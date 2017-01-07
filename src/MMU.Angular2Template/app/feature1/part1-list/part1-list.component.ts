import { Component, OnInit } from "@angular/core";

import * as services from "../shared/services/index";
import * as models from "../shared/models/index";

@Component({
    moduleId: module.id,
    templateUrl: "./part1-list.component.html"
})

export class Part1ListComponent implements OnInit {
    private helloWorlds: models.HelloWorld[];
    private errorWarning: string;

    public constructor(private helloWorldService: services.HelloWorldService) {
        this.helloWorlds = [];
    }

    private throwException(): void {
        this.helloWorldService.throwException()
        .then((result: models.HelloWorld[]) => {
            this.helloWorlds = result;
        })
            .catch((rejectedReason: any) => {
                this.errorWarning = rejectedReason;
            });
    }

    public ngOnInit() {
        this.helloWorldService.getHelloWorlds()
            .then((result: models.HelloWorld[]) => {
                this.helloWorlds = result;
            })
            .catch((rejectedReason: any) => {
                this.errorWarning =  rejectedReason;
            });
    }
}