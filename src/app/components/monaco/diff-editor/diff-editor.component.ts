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
    this.editor = monaco.editor.createDiffEditor(view, {
      ...this.defaultOptions,
      ...this.options
    });
    const originalModel = monaco.editor.createModel(this.committedModel, "text/plain");
    const modifiedModel = monaco.editor.createModel(this.workingModel, "text/plain");
    this.editor.setModel({ original: originalModel, modified: modifiedModel });

    // TODO: merge view
    // https://microsoft.github.io/monaco-editor/playground.html#interacting-with-the-editor-rendering-glyphs-in-the-margin
    // https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-codelens-provider-example
    // https://github.com/Symbolk/IntelliMerge-UI
    // https://medium.com/@lyuda.dzyubinska/monaco-editor-code-lens-provider-133ac9a13f84
    // Access the modified editor: this.editor.getModifiedEditor();
  }
}
