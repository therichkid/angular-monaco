import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SettingsComponent } from "./components/settings/settings.component";
import { EditorComponent } from "./components/monaco/editor/editor.component";
import { DiffEditorComponent } from "./components/monaco/diff-editor/diff-editor.component";

@NgModule({
  declarations: [AppComponent, SettingsComponent, EditorComponent, DiffEditorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
