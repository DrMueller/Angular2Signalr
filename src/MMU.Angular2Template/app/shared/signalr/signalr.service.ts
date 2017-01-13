import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import { ChannelConfig } from "./channel-config.model";
import { ChannelEvent } from "./channel-event.model"; 
import { ConnectionState } from "./connection-state.enum";
import { ChannelSubject } from "./channel-subject";

import * as coreServices from "../../core/services/index";

@Injectable()
export class ChannelService {
    public starting$: Observable<any>;
    public connectionState$: Observable<ConnectionState>;
    public error$: Observable<string>;

    private connectionStateSubject = new Subject<ConnectionState>();
    private startingSubject = new Subject<any>();
    private errorSubject = new Subject<any>();

    private hubConnection: any;
    private hubProxy: any;
    private subjects = new Array<ChannelSubject>();

    public constructor(private windowWrapperService: coreServices.WindowWrapperService) {
        if (windowWrapperService.$ === undefined || windowWrapperService.$.hubConnection === undefined) {
            throw new Error("The variable '$' or the .hubConnection() function are not defined...please check the SignalR scripts have been loaded properly");
        }

        let channelConfig = this.getConfiguredChannelConfig();

        this.connectionState$ = this.connectionStateSubject.asObservable();
        this.error$ = this.errorSubject.asObservable();
        this.starting$ = this.startingSubject.asObservable();

        this.hubConnection = windowWrapperService.$.hubConnection();
        this.hubConnection.url = channelConfig.url;
        this.hubProxy = this.hubConnection.createHubProxy(channelConfig.hubName);

        this.hubConnection.stateChanged((state: any) => {
            let newState = ConnectionState.Connecting;

            switch (state.newState) {
                case windowWrapperService.$.signalR.connectionState.connecting:
                    newState = ConnectionState.Connecting;
                    break;
                case windowWrapperService.$.signalR.connectionState.connected:
                    newState = ConnectionState.Connected;
                    break;
                case windowWrapperService.$.signalR.connectionState.reconnecting:
                    newState = ConnectionState.Reconnecting;
                    break;
                case windowWrapperService.$.signalR.connectionState.disconnected:
                    newState = ConnectionState.Disconnected;
                    break;
            }

            this.connectionStateSubject.next(newState);
        });

        this.hubConnection.error((error: any) => {
            this.errorSubject.next(error);
        });

        this.hubProxy.on("onEvent", (channel: string, ev: ChannelEvent) => {
            let channelSub = this.subjects.find((x: ChannelSubject) => {
                return x.channel === channel;
            }) as ChannelSubject;

            if (channelSub !== undefined) {
                return channelSub.subject.next(ev);
            }
        });

    }

    public start(): void {
        this.hubConnection.start()
            .done(() => {
                this.startingSubject.next();
            })
            .fail((error: any) => {
                this.startingSubject.error(error);
            });
    }

    public sub(channel: string): Observable<ChannelEvent> {

        let channelSub = this.subjects.find((x: ChannelSubject) => {
            return x.channel === channel;
        }) as ChannelSubject;

        if (channelSub !== undefined) {
            console.log(`Found existing observable for ${channel} channel`);
            return channelSub.subject.asObservable();
        }

        channelSub = new ChannelSubject();
        channelSub.channel = channel;
        channelSub.subject = new Subject<ChannelEvent>();
        this.subjects.push(channelSub);

        this.starting$.subscribe(() => {
            this.hubProxy.invoke("Subscribe", channel)
                .done(() => {
                    console.log(`Successfully subscribed to ${channel} channel`);
                })
                .fail((error: any) => {
                    channelSub.subject.error(error);
                });
        },
            (error: any) => {
                channelSub.subject.error(error);
            });

        return channelSub.subject.asObservable();
    }

    public publish(ev: ChannelEvent): void {
        this.hubProxy.invoke("Publish", ev);
    }

    private getConfiguredChannelConfig(): ChannelConfig {
        let signalrUrl = this.windowWrapperService.location.origin + "/signalr";
        let channelConfig = new ChannelConfig();
        channelConfig.url = signalrUrl;
        channelConfig.hubName = "ChannelHub"; // This name has to match the Type-Name on the Server-Class

        return channelConfig;
    }
}