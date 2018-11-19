import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject, BehaviorSubject, from } from 'rxjs';
import { withLatestFrom, scan, merge, shareReplay, pluck, filter, combineLatest, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user;
  socket;
  subscription;
  system$;
  message$ = new Subject();
  target$ = new BehaviorSubject('group');
  send$ = new Subject();
  groupBy$;
  list$;
  messageList$;
  data$;
  send(v) {
    if (!v.trim()) {
      return;
    }
    this.send$.next(v);
  }
  sendMessage() {
    return this.send$.pipe(withLatestFrom(this.target$, (msg, target) => {
      return {
        from: this.user,
        target,
        msg,
        time: Date.now()
      };
    })).subscribe(data => this.socket.emit('message', data));
  }
  initMessage(messages) {
    this.data$ = from(messages).pipe(
      merge(this.message$),
      scan((acc, cur) => [...acc, cur], []),
      shareReplay(1)
    );
    this.system$ = this.message$.pipe(
      filter(item => item[0] === 'system'),
      pluck('1'),
      shareReplay(1)
    );
    this.messageList$ = this.data$.pipe(
      combineLatest(this.target$.pipe(distinctUntilChanged()), (data, target) => {
        return data.filter(item => item[0] === target).map(item => item[1]);
      })
    );
    this.socket.on('message', data => {
      this.message$.next(data);
    });
  }
  initList(list) {
    const a = this.system$.pipe(
      scan((acc, cur) => {
        if (cur.type === 'join') {
          if (cur.username === this.user) {
            return acc;
          } else {
            return [...acc, { username: cur.username, newMessageCount: 0 }];
          }
        } else {
          const i = acc.findIndex(item => item.username === cur.username);
          acc.splice(i, 1);
          return acc;
        }
      }, [{ username: 'group', newMessageCount: 0 }, ...list.map(item => ({ username: item, newMessageCount: 0 }))]),
    );
    this.list$ = this.message$.pipe(
      withLatestFrom(a, this.target$, (message, l, target) => {
        if (message[0] !== 'system' && (message[1].from !== target) && (message[1].from !== this.user)) {
          l.find(item => item.username === message[1].from).newMessageCount++;
        }
        if (message[0] === 'group' && (target !== 'group')) {
          l.find(item => item.username === 'group').newMessageCount++;
        }
        return l;
      }),
      shareReplay(1)
    );
  }
  createNewSocket({ username, data, list }) {
    this.socket = io('localhost:8888');
    this.socket.on('connect', () => {
      this.socket.emit('login', username);
      this.user = username;
    });
    this.subscription = this.sendMessage();
    this.initMessage(data);
    this.initList(list);
  }
  reconnectSocket() {
    this.socket.connect();
  }
  disconnectSocket() {
    this.socket.disconnect();
    this.subscription.unsubscribe();
    this.user = '';
    this.socket = null;
  }
  constructor() { }
}
