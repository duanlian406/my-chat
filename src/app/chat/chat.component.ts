import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { LoginService } from '../login/login.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  get systemInfo() {
    return this.service.system$.pipe(map(item => `${item.username} ${item.type} the group`));
  }
  get currentList() {
    return this.service.list$;
  }
  get user() {
    return this.service.user;
  }
  target;
  constructor(private service: ChatService, private login: LoginService) { }

  ngOnInit() {
    if (this.service.user) {
      this.service.reconnectSocket();
    } else {
      this.service.createNewSocket(this.login.userInfo);
    }
    this.service.target$.subscribe(item => this.target = item);
  }
}
