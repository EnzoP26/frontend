import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Counter } from './counter';
import { Observable, Subscription  } from 'rxjs';
import { ActionCableService, Channel } from 'angular2-actioncable';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  public initialValue = [12, 5, 7];
  subscription: Subscription;

  private counterObservable: Map<number,Observable<Counter>> = new Map() ;

  constructor(private http: HttpClient,private cableService: ActionCableService) { 

  const channel: Channel = this.cableService
  .cable('wss://lp4asgadot.herokuapp.com/cable')
  .channel('CountersChannel', {});

 
  this.subscription = channel.received().subscribe(message => {
    
  console.log(message, this.counterObservable[message.id]);

    if(this.counterObservable.has(message.id)) {
      console.log("emit");
      this.counterObservable[message.id].emit({id: message.id, name: message.name, value:message.value})
    }
  });
}

/*
  increment(position: number): number {
    this.initialValue[position]++;
    return this.initialValue[position];
  }*/
 reset() {
    this.initialValue = [0, 0, 0];
  }

  increment(position: number) {
    this.http.patch<any>(".netlify/functions/increment", {counterId: position}).subscribe()
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
