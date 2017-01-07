import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable } from "rxjs/Observable";

@Injectable()
export class HttpService {
    constructor(private http: Http) { }

    get<T>(url: string): Promise<T> {
        return this.http.get(url)
            .map(this.extractJson)
            .toPromise()
            .catch(this.handleError);
    }

    private extractJson(res: Response) {
        const body = res.json();
        return body;
    }

    private extractArray(res: Response) {
        const body = res.json();
        return body.data || {};
    }

    private handleError(error: any) {
        // Low Level technical logging
        // We pass the error via promise to give the client the possibility to show a nice message
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);
        return Promise.reject(errMsg);
    }
}