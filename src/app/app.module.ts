import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@portinari/portinari-ui';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LoginService } from './login.service';
import { PoTemplatesModule } from '@portinari/portinari-templates';
import { AppHostDirective } from './app-host.directive';
import { TasksComponent } from './tasks/tasks.component';
import { HistoryComponent } from './history/history.component';
import { TaskFilterComponent } from './task-filter/task-filter.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { UpdateTaskComponent } from './update-task/update-task.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AppHostDirective,
    TasksComponent,
    HistoryComponent,
    TaskFilterComponent,
    NewTaskComponent,
    UpdateTaskComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PoModule,
    RouterModule.forRoot([]),
    PoTemplatesModule
  ],
  providers: [LoginService, CookieService],
  bootstrap: [AppComponent],
  entryComponents: [TasksComponent, HistoryComponent]
})
export class AppModule { }
