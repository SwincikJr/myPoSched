import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';

import { PoMenuItem, PoToolbarAction, PoToolbarProfile } from '@portinari/portinari-ui';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { AppHostDirective } from '../app-host.directive';
import { TasksComponent } from '../tasks/tasks.component';
import { HistoryComponent } from '../history/history.component';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild(AppHostDirective, {static: true}) appHost: AppHostDirective;

  pageTitle: String = 'Home';

  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', action: this.loadTasksComponent.bind(this) },
    { label: 'Histórico', action: this.loadHistoryComponent.bind(this)}
  ];

  readonly actions: Array<PoToolbarAction> = [
    { label: 'Logoff', action: this.logoff.bind(this) }
  ];

  profile: PoToolbarProfile = {
    title: '', avatar: "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_960_720.png"
  };

  constructor(public loginService: LoginService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver, public categoryService: CategoryService) { }

  ngOnInit() {
    if(this.loginService.mustLogin()) {
      this.router.navigateByUrl('login');
    } else {
      this.profile.title = this.loginService.getUser_name();
      this.loadComponent(TasksComponent);
    }
  }

  logoff() {
    this.loginService.logoff();
    this.router.navigateByUrl('login');
  }

  loadHistoryComponent() {
    this.pageTitle = 'Histórico';
    this.loadComponent(HistoryComponent);
  }

  loadTasksComponent() {
    this.pageTitle = 'Home';
    this.loadComponent(TasksComponent);
  }

  loadComponent(component) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.appHost.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
  }
}
