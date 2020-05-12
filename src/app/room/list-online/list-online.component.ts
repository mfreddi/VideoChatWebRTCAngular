import { Component, OnInit, Input } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Observable, combineLatest, of } from 'rxjs';
import { RTCService } from 'src/app/services/rtc.service';
import { map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-list-online',
  templateUrl: './list-online.component.html',
  styleUrls: ['./list-online.component.less']
})
export class ListOnlineComponent implements OnInit {
  stateList = new Set([]);
  list: Observable<Set<string[]>>;
  constructor(private websocket: WebsocketService, private rtc: RTCService) { }

  ngOnInit(): void {
    const userList$ = this.websocket.updateUserList();
    const removeUser$ = this.websocket.removeUser().pipe(startWith(''));
    this.list = combineLatest([removeUser$, userList$]).pipe(
      map(([removeUser, userList]) => {
        userList.forEach(ul => {
          this.stateList.add(ul);
        });
        if (removeUser) {
          this.stateList.delete(removeUser);
        }
        return this.stateList;
      })
    );
  }
  callUser(id: string) {
    this.rtc.callUser(id);
  }
}
