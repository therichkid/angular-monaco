import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  model = ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n");
  settings = {
    editor: "editor" as "editor" | "diffEditor"
  };
}
