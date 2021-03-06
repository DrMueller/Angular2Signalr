﻿import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { HelloWorld } from "../models/hello-world.model";
import { Observable } from "rxjs/Observable";

import * as http from "../../../shared/http/index";


@Injectable()
export class HelloWorldService {
    constructor(private httpService: http.HttpService) { }

    getHelloWorlds(): Promise<HelloWorld[]> {
        const url = "api/HelloWorld/helloWorlds";
        return this.httpService.get<HelloWorld[]>(url);
    }

    throwException(): Promise<HelloWorld[]> {
        const url = "api/HelloWorld/exception";
        return this.httpService.get<HelloWorld[]>(url);
    }
}