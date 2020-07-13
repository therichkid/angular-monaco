import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { environment } from "../../../environments/environment";

// Add monaco typings
/// <reference path="monaco.d.ts" />

declare const ResizeObserver;

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() monacoModel = ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n");
  @Input() options: { [key: string]: any } = {};

  defaultOptions: { [key: string]: any } = {
    language: "typescript",
    theme: "vs-dark"
  };
  editor: { [key: string]: any };
  basePath = environment.MONACO_BASE_PATH;
  resizeObserver: any;

  @ViewChild("editor") view: ElementRef;
  @ViewChild("container") containerView: ElementRef;

  @Output() monacoModelChange = new EventEmitter<string>();

  constructor() {}

  async ngAfterViewInit(): Promise<void> {
    await this.initAmdLoader();
    await this.initMonaco();
    this.initResizeObserver();
    this.createInstance();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.editor.getModel().dispose();
    this.editor.dispose();
    const view: HTMLDivElement = this.containerView.nativeElement;
    this.resizeObserver.unobserve(view);
  }

  initAmdLoader(): Promise<void> {
    return new Promise((resolve: any) => {
      if ((window as any).require) {
        resolve();
        return;
      }
      const loaderScript: HTMLScriptElement = document.createElement("script");
      loaderScript.type = "text/javascript";
      loaderScript.src = `${this.basePath}/vs/loader.js`;
      loaderScript.addEventListener("load", () => {
        resolve();
      });
      document.body.appendChild(loaderScript);
    });
  }

  initMonaco(): Promise<void> {
    return new Promise((resolve: any) => {
      if (typeof (window as any).monaco === "object") {
        resolve();
        return;
      }
      (window as any).require.config({ paths: { vs: `${this.basePath}/vs` } });
      (window as any).require(["vs/editor/editor.main"], () => {
        resolve();
      });
    });
  }

  initResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.editor) {
        this.editor.layout();
      }
    });
    const view: HTMLDivElement = this.containerView.nativeElement;
    this.resizeObserver.observe(view);
  }

  createInstance(): void {
    const view: HTMLDivElement = this.view.nativeElement;
    this.editor = (window as any).monaco.editor.create(view, {
      ...this.defaultOptions,
      ...this.options
    });
    this.editor.setValue(this.monacoModel);
  }
}
