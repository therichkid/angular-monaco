import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SettingsComponent } from "./components/settings/settings.component";
import { EditorComponent } from "./components/monaco/editor/editor.component";
import { DiffEditorComponent } from './components/monaco/diff-editor/diff-editor.component';

@NgModule({
  declarations: [AppComponent, SettingsComponent, EditorComponent, DiffEditorComponent],
  imports: [BrowserModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
