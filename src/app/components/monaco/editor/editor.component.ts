import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";

import { BaseDirective } from "../base.directive";

declare const JSHINT;

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class EditorComponent extends BaseDirective implements OnInit, OnChanges {
  @Input() model = "";
  @Input() options: { [key: string]: any } = {};
  @Input() monacoOptions: { [key: string]: any } = {};

  defaultOptions: { [key: string]: any } = {
    language: "javascript",
    theme: "vs-dark"
  };
  editor: { [key: string]: any };

  @ViewChild("editor") view: ElementRef;
  @ViewChild("container") containerView: ElementRef;

  @Output() modelChange = new EventEmitter<string>();

  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editor) {
      return;
    }
    if (changes.model && changes.model.currentValue !== this.editor.getValue()) {
      this.editor.setValue(changes.model.currentValue);
    }
  }

  createInstance(): void {
    const view: HTMLDivElement = this.view.nativeElement;
    const options = {
      ...this.defaultOptions,
      ...this.options
    };
    this.editor = monaco.editor.create(view, options);
    // Set initial value
    this.editor.setValue(this.model);
    // Trigger events on model change
    this.editor.onDidChangeModelContent(() => {
      this.model = this.editor.getValue();
      this.modelChange.emit(this.model);
      if (options.language && options.language === "javascript" && this.monacoOptions.useJsHint) {
        this.addJsHintLinting();
      }
    });
  }

  addJsHintLinting(): void {
    JSHINT(this.model, { indent: 4, esversion: 6 }, {});
    let markers: monaco.editor.IMarker[] = [];
    if (JSHINT.data().errors) {
      markers = JSHINT.data().errors.map((error: { [key: string]: any }) => ({
        startLineNumber: error.line,
        endLineNumber: error.line,
        startColumn: error.character - 1,
        endColumn: error.character - 1,
        message: error.reason,
        severity: error.code && error.code.startsWith("E") ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
        source: "jshint"
      }));
    }
    monaco.editor.setModelMarkers(this.editor.getModel(), "jshint", markers);
  }
}
