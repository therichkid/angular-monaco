import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";

import { BaseDirective } from "../base.directive";

@Component({
  selector: "app-diff-editor",
  templateUrl: "./diff-editor.component.html",
  styleUrls: ["./diff-editor.component.scss"]
})
export class DiffEditorComponent extends BaseDirective implements OnInit {
  @Input() committedModel = ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n");
  @Input() workingModel = ["function y() {", '\tconsole.log("Hello world!");', "}"].join("\n");
  @Input() options: { [key: string]: any } = {};

  defaultOptions: { [key: string]: any } = {
    language: "typescript",
    theme: "vs-dark"
  };
  editor: { [key: string]: any };

  @ViewChild("editor") view: ElementRef;
  @ViewChild("container") containerView: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  createInstance(): void {
    const view: HTMLDivElement = this.view.nativeElement;
    this.editor = (window as any).monaco.editor.createDiffEditor(view, {
      ...this.defaultOptions,
      ...this.options
    });
    const originalModel = (window as any).monaco.editor.createModel(this.committedModel, "text/plain");
    const modifiedModel = (window as any).monaco.editor.createModel(this.workingModel, "text/plain");
    this.editor.setModel({ original: originalModel, modified: modifiedModel });
  }
}
