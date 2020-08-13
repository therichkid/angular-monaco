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
    theme: "vs-dark",
    glyphMargin: true,
    lineNumbersMinChars: 3
  };
  editor: { [key: string]: any };
  breakpoints: number[] = [];
  currentlyActiveBreakpoint: number;

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
    if (this.monacoOptions.enableDebugging) {
      this.initBreakpointEventListener();
    }
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

  initBreakpointEventListener(): void {
    // https://github.com/polylith/monaco-debugger
    this.editor.onMouseDown((mouseEvent: monaco.editor.IEditorMouseEvent) => {
      if (mouseEvent.target.type === 2) {
        // 2 is the target number for clicks within the glyph margin
        const line = mouseEvent.target.position?.lineNumber;
        this.toggleBreakpoint(line);
      }
    });
  }

  toggleBreakpoint(line: number): void {
    const lineIndex = this.breakpoints.indexOf(line);
    if (lineIndex === -1) {
      this.addBreakpoint(line);
      this.breakpoints.push(line);
    } else {
      this.removeBreakpoint(line);
      this.breakpoints.splice(lineIndex, 1);
    }
    // Add a mockup currently active breakpoint
    if (this.breakpoints.length === 1 && !this.currentlyActiveBreakpoint) {
      this.addCurrentlyActiveBreakpoint(line);
      this.currentlyActiveBreakpoint = line;
    } else if (!this.breakpoints.length || (lineIndex > -1 && this.currentlyActiveBreakpoint === line)) {
      this.removeCurrentlyActiveBreakpoint(line);
      this.currentlyActiveBreakpoint = null;
      if (this.breakpoints.length) {
        this.addCurrentlyActiveBreakpoint(this.breakpoints[0]);
      }
    }
  }

  addBreakpoint(line: number): void {
    const decoration: monaco.editor.IModelDeltaDecoration = {
      range: new monaco.Range(line, 1, line, 1),
      options: { isWholeLine: false, glyphMarginClassName: "breakpoint" }
    };
    this.editor.deltaDecorations([], [decoration]);
  }

  removeBreakpoint(line: number): void {
    const currentDecorations: monaco.editor.IModelDecoration[] = this.editor.getLineDecorations(line) || [];
    this.editor.deltaDecorations(
      currentDecorations.filter((value) => value.options.glyphMarginClassName === "breakpoint").map((value) => value.id),
      []
    );
  }

  addCurrentlyActiveBreakpoint(line: number): void {
    const decoration: monaco.editor.IModelDeltaDecoration = {
      range: new monaco.Range(line, 1, line, 1),
      options: { isWholeLine: true, className: "active-breakpoint" }
    };
    this.editor.deltaDecorations([], [decoration]);
  }

  removeCurrentlyActiveBreakpoint(line: number): void {
    const currentDecorations: monaco.editor.IModelDecoration[] = this.editor.getLineDecorations(line) || [];
    this.editor.deltaDecorations(
      currentDecorations.filter((value) => value.options.className === "active-breakpoint").map((value) => value.id),
      []
    );
  }

  formatCode(): void {
    this.editor.getAction("editor.action.formatDocument").run();
  }
}
