import { ChannelEvent } from "./channel-event.model";
import { Subject } from "rxjs/Subject";

export class ChannelSubject {
    channel: string;
    subject: Subject<ChannelEvent>;
}
