import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

export interface Settings {
  editor: "editor" | "diffEditor";
  language: "typescript" | "javascript" | "json" | "sql";
  useJsHint?: boolean;
  enableDebugging?: boolean;
}

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  @Input() model: string;
  settings: Settings = {
    editor: "editor",
    language: "javascript",
    useJsHint: false
  };
  languages = [
    { label: "TypeScript", value: "typescript" },
    { label: "JavaScript", value: "javascript" },
    { label: "JSON", value: "json" },
    { label: "SQL", value: "sql" }
  ];
  isTextareaInFocus = false;
  extraLib = `declare namespace myNamespace {
  function myFun(myStr: string): void;
  let myVar: number;
  let myObj: {
    myNestedStr: string
  }
}`;
  addedExtraLibs: string[] = [];
  extraLibToDelete: string;
  @Output() settingsChange = new EventEmitter<{ [key: string]: any }>();
  @Output() modelChange = new EventEmitter<string>();

  myTest: string;

  constructor() {}

  ngOnInit(): void {}

  onSettingsChange(key: string, value: string): void {
    this.settings[key] = value;
    this.settingsChange.emit({ ...this.settings });
  }

  onModelChange(model: string): void {
    if (this.isTextareaInFocus) {
      this.modelChange.emit(model);
    }
  }

  addExtraLib(): void {
    // https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html
    monaco.languages.typescript.typescriptDefaults.addExtraLib(this.extraLib);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(this.extraLib);
    this.addedExtraLibs.push(this.extraLib);
  }

  removeExtraLib(): void {
    const libsToKeep = [];
    const languageDefaults = ["typescriptDefaults", "javascriptDefaults"];
    for (const languageDefault of languageDefaults) {
      const extraLibs = Object.values(
        monaco.languages.typescript[languageDefault].getExtraLibs() as monaco.languages.typescript.LanguageServiceDefaults
      );
      for (const lib of extraLibs) {
        if (lib.content !== this.extraLibToDelete) {
          libsToKeep.push(lib);
        } else {
          this.addedExtraLibs.filter((addedLib: string) => lib.content !== addedLib);
        }
      }
      monaco.languages.typescript[languageDefault].setExtraLibs(libsToKeep); // or [] to remove all extra libs at once
    }
  }
}
