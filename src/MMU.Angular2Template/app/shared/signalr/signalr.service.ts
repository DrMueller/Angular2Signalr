﻿import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import * as signalr from "./Index";
import { ChannelSubject } from "./channel-subject";
import * as coreServices from "../../core/services/index";



/**
 * ChannelService is a wrapper around the functionality that SignalR
 * provides to expose the ideas of channels and events. With this service
 * you can subscribe to specific channels (or groups in signalr speak) and
 * use observables to react to specific events sent out on those channels.
 */
@Injectable()
export class ChannelService {
    /**
     * starting$ is an observable available to know if the signalr 
     * connection is ready or not. On a successful connection this
     * stream will emit a value.
     */
    starting$: Observable<any>;

    /**
     * connectionState$ provides the current state of the underlying
     * connection as an observable stream.
     */
    connectionState$: Observable<signalr.ConnectionState>;

    /**
     * error$ provides a stream of any error messages that occur on the 
     * SignalR connection
     */
    error$: Observable<string>;

    // These are used to feed the public observables 
    //
    private connectionStateSubject = new Subject<signalr.ConnectionState>();
    private startingSubject = new Subject<any>();
    private errorSubject = new Subject<any>();

    // These are used to track the internal SignalR state 
    //
    private hubConnection: any;
    private hubProxy: any;

    // An internal array to track what channel subscriptions exist 
    //
    private subjects = new Array<ChannelSubject>();

    constructor(windowWrapperService: coreServices.WindowWrapperService) {
        if (windowWrapperService.$ === undefined || windowWrapperService.$.hubConnection === undefined) {
            throw new Error("The variable '$' or the .hubConnection() function are not defined...please check the SignalR scripts have been loaded properly");
        }

        let signalrUrl = windowWrapperService.location.origin + "/signalr";
        let channelConfig = new signalr.ChannelConfig();
        channelConfig.url = signalrUrl;
        channelConfig.hubName = "ChannelHub"; // This name has to match the Type-Name on the Server-Class

        this.connectionState$ = this.connectionStateSubject.asObservable();
        this.error$ = this.errorSubject.asObservable();
        this.starting$ = this.startingSubject.asObservable();

        this.hubConnection = windowWrapperService.$.hubConnection();
        this.hubConnection.url = channelConfig.url;
        this.hubProxy = this.hubConnection.createHubProxy(channelConfig.hubName);

        this.hubConnection.stateChanged((state: any) => {
            let newState = signalr.ConnectionState.Connecting;

            switch (state.newState) {
                case windowWrapperService.$.signalR.connectionState.connecting:
                    newState = signalr.ConnectionState.Connecting;
                    break;
                case windowWrapperService.$.signalR.connectionState.connected:
                    newState = signalr.ConnectionState.Connected;
                    break;
                case windowWrapperService.$.signalR.connectionState.reconnecting:
                    newState = signalr.ConnectionState.Reconnecting;
                    break;
                case windowWrapperService.$.signalR.connectionState.disconnected:
                    newState = signalr.ConnectionState.Disconnected;
                    break;
            }

            // Push the new state on our subject
            //
            this.connectionStateSubject.next(newState);
        });

        // Define handlers for any errors
        //
        this.hubConnection.error((error: any) => {
            // Push the error on our subject
            //
            this.errorSubject.next(error);
        });

        this.hubProxy.on("onEvent", (channel: string, ev: signalr.ChannelEvent) => {
            //console.log(`onEvent - ${channel} channel`, ev);

            // This method acts like a broker for incoming messages. We 
            //  check the interal array of subjects to see if one exists
            //  for the channel this came in on, and then emit the event
            //  on it. Otherwise we ignore the message.
            //
            let channelSub = this.subjects.find((x: ChannelSubject) => {
                return x.channel === channel;
            }) as ChannelSubject;

            // If we found a subject then emit the event on it
            //
            if (channelSub !== undefined) {
                return channelSub.subject.next(ev);
            }
        });

    }

    /**
     * Start the SignalR connection. The starting$ stream will emit an 
     * event if the connection is established, otherwise it will emit an
     * error.
     */
    start(): void {
        // Now we only want the connection started once, so we have a special
        //  starting$ observable that clients can subscribe to know know if
        //  if the startup sequence is done.
        //
        // If we just mapped the start() promise to an observable, then any time
        //  a client subscried to it the start sequence would be triggered
        //  again since it's a cold observable.
        //
        this.hubConnection.start()
            .done(() => {
                this.startingSubject.next();
            })
            .fail((error: any) => {
                this.startingSubject.error(error);
            });
    }

    /** 
     * Get an observable that will contain the data associated with a specific 
     * channel 
     * */
    sub(channel: string): Observable<signalr.ChannelEvent> {

        // Try to find an observable that we already created for the requested 
        //  channel
        //
        let channelSub = this.subjects.find((x: ChannelSubject) => {
            return x.channel === channel;
        }) as ChannelSubject;

        // If we already have one for this event, then just return it
        //
        if (channelSub !== undefined) {
            console.log(`Found existing observable for ${channel} channel`);
            return channelSub.subject.asObservable();
        }

        //
        // If we're here then we don't already have the observable to provide the
        //  caller, so we need to call the server method to join the channel 
        //  and then create an observable that the caller can use to received
        //  messages.
        //

        // Now we just create our internal object so we can track this subject
        //  in case someone else wants it too
        //
        channelSub = new ChannelSubject();
        channelSub.channel = channel;
        channelSub.subject = new Subject<signalr.ChannelEvent>();
        this.subjects.push(channelSub);

        // Now SignalR is asynchronous, so we need to ensure the connection is
        //  established before we call any server methods. So we'll subscribe to 
        //  the starting$ stream since that won't emit a value until the connection
        //  is ready
        //
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

    // Not quite sure how to handle this (if at all) since there could be
    //  more than 1 caller subscribed to an observable we created
    //
    // unsubscribe(channel: string): Rx.Observable<any> {
    //     this.observables = this.observables.filter((x: ChannelObservable) => {
    //         return x.channel === channel;
    //     });
    // }

    /** publish provides a way for calles to emit events on any channel. In a 
     * production app the server would ensure that only authorized clients can
     * actually emit the message, but here we're not concerned about that.
     */
    publish(ev: signalr.ChannelEvent): void {
        this.hubProxy.invoke("Publish", ev);
    }

}