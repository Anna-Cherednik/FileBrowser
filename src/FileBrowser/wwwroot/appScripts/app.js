"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const http_2 = require('@angular/http');
let AppComponent = class AppComponent {
    //files: any = {};
    //items: DirectoryBrowser;
    constructor(http) {
        this.http = http;
        this.items = {};
    }
    ngOnInit() {
        this.getItems();
    }
    getItems() {
        this.http.get("/api/directory")
            .subscribe(data => { this.items = data.json(); }, err => console.error(err), () => console.log("done"));
        //this.files = this.items.count;
    }
    nextHop(selected) {
        let body = JSON.stringify({ "selected": selected, "level": this.items.level, "path": this.items.path });
        this.items.path = "Waiting...";
        let headers = new http_2.Headers({ "Content-Type": "application/json" });
        let options = new http_2.RequestOptions({ headers: headers });
        if (!selected) {
            return;
        }
        this.http.post("/api/directory", body, options)
            .subscribe(data => { this.items = data.json(); }, err => console.error(err), () => console.log("done"));
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: "my-app",
        template: `
               <div class="main">
                  <table>
                      <tr>
                           <th>Less 10Mb</th>         <th>10Mb-50Mb</th>          <th>More 100 Mb</th>
                      </tr>
                      <tr>
                           <td>{{items?.count?.small}}</td> <td>{{items?.count?.medium}}</td> <td>{{items?.count?.large}}</td>
                      </tr>
                  </table>               

               <div class="text">
                    <h4>
                       <span [ngSwitch]="items.path">
                           <span *ngSwitchCase="'Selected drive to show information'">{{items.path}}</span>
                           <span *ngSwitchCase="'Waiting...'">{{items.path}}</span>
                           <span *ngSwitchDefault>Current path: <span class="normal">{{items.path}}</span></span>
                       </span>
                   </h4>
                   <div class="border">
                       <p class="link" *ngFor="let el of items.dirs" (click)="nextHop(el)">{{el}}</p>
                       <p class="files" *ngFor="let el of items.files">{{el}}</p>
                   </div>
                </div>

              </div>

              `
    }), 
    __metadata('design:paramtypes', [http_1.Http])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.js.map