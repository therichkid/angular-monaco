import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

export interface Settings {
  editor: "editor" | "diffEditor";
  language: "typescript" | "javascript" | "json" | "sql";
  useJsHint?: boolean;
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
  @Output() settingsChange = new EventEmitter<{ [key: string]: any }>();
  @Output() modelChange = new EventEmitter<string>();

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
}
