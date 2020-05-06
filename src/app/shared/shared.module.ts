import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';
import { ProgressLoadingComponent } from './progress.component/progress.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@NgModule({
      // Remember, declaration has to be made only once(in the module that is created), use them by exporting and importing
    declarations: [
        AlertComponent,
        PlaceholderDirective,
        DropdownDirective,
        ProgressLoadingComponent,
        LoadingSpinnerComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        PlaceholderDirective,
        DropdownDirective,
        ProgressLoadingComponent,
        LoadingSpinnerComponent,
        CommonModule
    ],
      // this is not required in angular 9
    // the component that would be created dynamically in the projects are to be noted Here.
    entryComponents: [
        AlertComponent
    ]
})
export class SharedModule{

}