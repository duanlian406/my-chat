import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'list-panel',
  templateUrl: './list-panel.component.html',
  styleUrls: ['./list-panel.component.scss']
})
export class ListPanelComponent implements OnInit {
  @Input() items;
  target;
  changeTarget(user) {
    this.service.target$.next(user);
  }
  constructor(private service: ChatService) { }

  ngOnInit() {
    this.service.target$.subscribe(item => this.target = item);
  }

}
