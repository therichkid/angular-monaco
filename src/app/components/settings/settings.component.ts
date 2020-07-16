import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  @Input() model: string;
  settings = {
    editor: "editor" as "editor" | "diffEditor"
  };
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
