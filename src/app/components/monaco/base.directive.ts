import { AfterViewInit, OnDestroy, ElementRef, Directive } from "@angular/core";

import { environment } from "../../../environments/environment";

declare const ResizeObserver;

@Directive()
export abstract class BaseDirective implements AfterViewInit, OnDestroy {
  basePath = environment.MONACO_BASE_PATH;
  resizeObserver: any;
  abstract editor: { [key: string]: any };
  abstract containerView: ElementRef;

  constructor() {}

  async ngAfterViewInit(): Promise<void> {
    await this.initAmdLoader();
    await this.initMonaco();
    this.initResizeObserver();
    this.createInstance();
  }

  ngOnDestroy(): void {
    if (typeof this.editor.getModel.dispose === "function") {
      this.editor.getModel().dispose();
    }
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
      if (typeof monaco === "object") {
        resolve();
        return;
      }
      (window as any).require.config({ paths: { vs: `${this.basePath}/vs` } });
      (window as any).require(["vs/editor/editor.main"], () => {
        this.setJsDefaults();
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

  setJsDefaults(): void {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      checkJs: true,
      allowJs: true,
      lib: ["es6"] // Only add specific libs (es6, dom, ...). To remove all, add `noLib: true`
    });
  }

  abstract createInstance(): void;
}
