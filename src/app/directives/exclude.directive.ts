import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appExclude]'
})
export class ExcludeDirective {

  constructor(private el: ElementRef) {
    console.log(el);
    // el.appExclude = true;
  }

}
