import { Injectable, ElementRef } from '@angular/core';
import { WebsocketService } from './websocket.service';
const { RTCPeerConnection, RTCSessionDescription } = window;

@Injectable({
  providedIn: 'root'
})
export class RTCService {
  private peerConnection = new RTCPeerConnection();
  private state = this.peerConnection.iceConnectionState;
  getCalled = true;
  isAlreadyCalling = false;
  constructor(private websocket: WebsocketService) {}
  private callMade() {
    this.websocket.on('call-made').subscribe(async (data: any) => {
      if (this.getCalled) {
        const confirmed = confirm(
          `User "Socket: ${data.socket}" wants to call you. Do accept this call?`
        );
        console.log('confirmed', confirmed);
        if (!confirmed) {
          this.websocket.sendMessage('reject-call', {
            from: data.socket
          });
          return;
        }
      }
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      this.websocket.sendMessage('make-answer', {
        answer,
        to: data.socket
      });
      this.getCalled = false;
    });

    this.websocket.on('answer-made').subscribe(async (data: any) => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      if (!this.isAlreadyCalling) {
        this.callUser(data.socket);
        this.isAlreadyCalling = true;
      }
    });

    this.websocket.on('call-rejected').subscribe((data: any) => {
      alert(`User: "Socket: ${data.socket}" rejected your call.`);
    });
  }
  public async callUser(socketId) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    this.websocket.sendMessage('call-user', {
      offer,
      to: socketId
    });
  }
  public ontrack(remoteVideo: ElementRef<HTMLVideoElement>): void {
    this.peerConnection.ontrack = ({ streams: [stream] }) => {
      const video = remoteVideo.nativeElement;
      if (video) {
        video.srcObject = stream;
      }
    };
  }
  public getUserMedia(localVideo: ElementRef<HTMLVideoElement>): void {
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        const video = localVideo.nativeElement;
        if (video) {
          video.srcObject = stream;
          video.muted = true;
        }
        stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));
      },
      error => {
        console.warn(error.message);
      }
    );
    this.callMade();
  }
  public userDisconect(localVideo: ElementRef<HTMLVideoElement>) {
    const video = localVideo.nativeElement;
  }
}
