import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable } from "rxjs/Observable";

import * as http from "../../../shared/http/index";


@Injectable()
export class SignalrTestService {
    constructor(private httpService: http.HttpService) { }

    public publishSomeSignalr(): void {
        const url = "api/SignalrTest/publishSomeSignalr";
        this.httpService.post(url, null, http.ContentType.ApplicationJson)
            .then((onFullfilled: any) => {
                // Not Needed
            })
            .catch((reason: any) => {
                // Not Needed
            });
    }
}