import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertComponent } from './_components';
import { HomeComponent, PlateDialog,ChoichesDialog } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { ImageViewerModule } from 'ng2-image-viewer';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';

// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatAutocompleteModule, MatInputModule} from '@angular/material';
@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ChoichesDialog,
    PlateDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ImageViewerModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatListModule,
    MatFormFieldModule,
    MatAutocompleteModule, MatInputModule,
    MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule
    ],

    entryComponents: [    ChoichesDialog,
      PlateDialog],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
