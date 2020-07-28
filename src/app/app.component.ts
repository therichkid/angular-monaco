import { Component } from "@angular/core";

import { Settings } from "./components/settings/settings.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  model = ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n");
  editorType: "editor" | "diffEditor" = "editor";
  options: { [key: string]: any } = {
    language: "javascript"
  };
  monacoOptions: { [key: string]: any } = {
    useJsHint: false,
    enableDebugging: false
  };

  constructor() {}

  onSettingsChange(settings: Settings): void {
    this.editorType = null;
    this.options.language = settings.language;
    this.monacoOptions.useJsHint = settings.useJsHint;
    this.monacoOptions.enableDebugging = settings.enableDebugging;
    setTimeout(() => {
      this.editorType = settings.editor;
    });
  }
}
