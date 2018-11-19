import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.scss']
})
export class MessagePanelComponent implements OnInit, AfterViewChecked {
  @ViewChild('list') list;
  goToBottom() {
    this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight;
  }
  send(input) {
    this.service.send(input.value);
    input.value = '';
  }
  get target() {
    return this.service.target$;
  }
  get messageList() {
    return this.service.messageList$;
  }
  constructor(private service: ChatService) { }
  ngAfterViewChecked() {
    this.goToBottom();
  }
  ngOnInit() {
  }

}
