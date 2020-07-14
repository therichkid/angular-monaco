import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";

import { BaseDirective } from "../base.directive";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class EditorComponent extends BaseDirective implements OnInit {
  @Input() monacoModel = ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n");
  @Input() options: { [key: string]: any } = {};

  defaultOptions: { [key: string]: any } = {
    language: "typescript",
    theme: "vs-dark"
  };
  editor: { [key: string]: any };

  @ViewChild("editor") view: ElementRef;
  @ViewChild("container") containerView: ElementRef;

  @Output() monacoModelChange = new EventEmitter<string>();

  constructor() {
    super();
  }

  ngOnInit(): void {}

  createInstance(): void {
    const view: HTMLDivElement = this.view.nativeElement;
    this.editor = (window as any).monaco.editor.create(view, {
      ...this.defaultOptions,
      ...this.options
    });
    this.editor.setValue(this.monacoModel);
  }
}
