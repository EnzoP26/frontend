import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Counter } from './counter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  public initialValue = [12, 5, 7];
  private counterObservable: Map<number,Observable<Counter>> = new Map() ;

  constructor(private http: HttpClient,/*private cableServicebbbite: NgxActionCableService*/) { }

  reset() {
    this.initialValue = [0, 0, 0];
  }
/*
  increment(position: number): number {
    this.initialValue[position]++;
    return this.initialValue[position];
  }*/


  increment(id : number): Observable<Counter>{
    this.http.patch("https://lp4asgadot.herokuapp.com/counters/"+id+".json",{"value" : 1}).subscribe();
    return this.http.get<Counter>("https://lp4asgadot.herokuapp.com/counters/"+id+".json");
  }

  getCounter(id: number): Observable<Counter> {
    //return this.http.get<Counter>("https://lp4asgadot.herokuapp.com/counters/"+id+".json");
    if (! this.counterObservable.has(id)){
       this.counterObservable[id] = new EventEmitter<Counter>();}
    else
    {  this.counterObservable[id] = new EventEmitter<Counter>()}
      this.http.get<Counter>("https://lp4asgadot.herokuapp.com/counters/"+id+".json").subscribe( counter => this.counterObservable[id].emit(counter));
    return this.counterObservable[id];
  }

  getCounters(): Observable<Counter[]> {
    return this.http.get<Counter[]>("https://lp4asgadot.herokuapp.com/counters.json");
  }
}
