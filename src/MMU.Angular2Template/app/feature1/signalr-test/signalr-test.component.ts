import { Component, OnInit } from "@angular/core";
import * as http from "../../shared/http/index";
import * as signalr from "../../shared/signalr/index";
import { SignalrTestService } from "../shared/services/signalr-test.service"; 


@Component({
    moduleId: module.id,
    templateUrl: "./signalr-test.component.html"
})

export class SignalrTestComponent implements OnInit{
    private CHANNEL_NAME: string = "Test2";

    private connectionState: string;
    private channelEvents: signalr.ChannelEvent[] = [];

    public constructor(private channelService: signalr.ChannelService, private signalrTestService: SignalrTestService) {
    }

    public ngOnInit(): void {
        this.initializeChannelService();
        this.channelService.start();
    }

    private publishSomeSignalr(): void {
        this.signalrTestService.publishSomeSignalr();
    }

    private initializeChannelService(): void {
        this.channelService.connectionState$
            .subscribe(
            (next: signalr.ConnectionState) => {
                this.connectionState = signalr.ConnectionState[next];
            },
            (error: any) => {
                console.error("errors$ error", error);
            }
            );

        this.channelService.error$.subscribe(
            (error: any) => { console.warn(error); },
            (error: any) => { console.error("errors$ error", error); }
        );

        this.channelService.sub(this.CHANNEL_NAME)
            .subscribe(
            (channelEvent: signalr.ChannelEvent) => {
                this.channelEvents.push(channelEvent);
            },
            (error: any) => {
                console.warn("Attempt to join channel failed!", error);
            }
            );

        this.channelService.starting$.subscribe(
            () => { console.log("signalr service has been started"); },
            () => { console.warn("signalr service failed to start!"); }
        );
    }
}