import {Component} from "@angular/core";
import {Http} from "@angular/http";
import { Headers, RequestOptions } from '@angular/http';

@Component({
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
})
export class AppComponent {
    items: any = {};
    //files: any = {};
    //items: DirectoryBrowser;

    constructor(private http: Http) {  }

    ngOnInit() {
        this.getItems();
    }

    getItems() {
        this.http.get("/api/directory")
            .subscribe(
            data => { this.items = data.json(); },
            err => console.error(err),
            () => console.log("done")
        );
        //this.files = this.items.count;
    }

    nextHop(selected: string) {
        let body = JSON.stringify({ "selected": selected, "level": this.items.level, "path": this.items.path });
        this.items.path = "Waiting...";
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        if (!selected) { return; }
        this.http.post("/api/directory", body, options)
            .subscribe(
            data => { this.items = data.json(); },
            err => console.error(err),
            () => console.log("done")
            );
    }
}

