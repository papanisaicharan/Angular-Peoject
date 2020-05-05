import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appPlaceHolder]'
})
export class PlaceholderDirective{
    // this gives the info about the place where it is used and help to do some imp functions there.
    constructor(public viewContainerRef: ViewContainerRef){}
}