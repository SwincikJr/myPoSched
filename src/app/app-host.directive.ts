import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHost]'
})
export class AppHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
