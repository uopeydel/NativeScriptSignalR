import { Component, OnInit } from "@angular/core";
import * as signalR from '@aspnet/signalr-client';

import { EventData } from "data/observable";
import { Button } from "ui/button";

import { Item } from "./item";
import { ItemService } from "./item.service";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    items: Item[];

    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.items = this.itemService.getItems(); 
    }

    public counter: number = 0;
    onTap(args: EventData) {
        let button = <Button>args.object;

        this.counter++;
        alert("Tapped " + this.counter + " times!");
        this.connection.invoke("Send","test"+this.counter);
    }

    StartSignalR(args: EventData) {
        let button = <Button>args.object;
        console.log("start signalr");
       this.doSigNalR();
    }
    
    connection: signalR.HubConnection;
    transportType: signalR.TransportType;

    
    users: Array<any> = new Array<any>();
    messages: Array<any> = new Array<any>();

    doSigNalR() {
        this.transportType = signalR.TransportType.WebSockets;
        let logger = new signalR.ConsoleLogger(signalR.LogLevel.Information);

        let connectOption = new signalR.HttpClient();
        console.log(connectOption.options);
        var Domain = `http://${document.location.host}/chat`;
        Domain = 'http://localhost:58141/Chat';
        let http = new signalR.HttpConnection(Domain, { transport: this.transportType, logging: logger});

        this.connection = new signalR.HubConnection(http);

        this.connection.onClosed = e => {
            if (e) {
                this.appendLine('Connection closed with error: ' + e, 'red');
            }
            else {
                this.appendLine('Disconnected', 'green');
            }
        };
  
        this.connection.on('Send', (userName, message) => {
            this.messages.push(userName + ':' + message);
        });

        this.connection.start()
            .then(data => {
        })
            .catch(err => {
            this.appendLine(err, 'red');
            this.connection.stop();
        });
    }
    appendLine(line: any, color?: any) {
        
        this.messages.push(line);
        console.log(this.messages);
    };
}