import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { RTCService } from '../services/rtc.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit, OnDestroy {
  id: string;
  socketId: string;
  @ViewChild('localVideo', {static: true}) localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo', {static: true}) remoteVideo: ElementRef<HTMLVideoElement>;

  constructor(private route: ActivatedRoute, private websocket: WebsocketService, private rtc: RTCService) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.websocket.connect();
    this.rtc.ontrack(this.remoteVideo);
    this.rtc.getUserMedia(this.localVideo);
  }

  ngOnDestroy() {
    this.websocket.disconect();
  }
  disconect() {
    this.websocket.disconect();
  }

}
