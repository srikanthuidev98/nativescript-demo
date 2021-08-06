import { Directive, ElementRef, OnInit, Renderer2, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from '../states/app.state';
import { Observable } from 'rxjs';
import { ThemeType, ThemeColor } from '../enums';


/**
 * Used to have themeing in the app.
 */
@Directive({ selector: '[appTheme]' })
export class ThemeDirective implements OnInit {

    @Input('appTheme') inputString = '';

    @Select(AppState.getTheme) theme$: Observable<ThemeType>;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    ngOnInit(): void {
        this.theme$.subscribe((theme) => {
            if (theme === ThemeType.Fastpay) {
                this.updateColor(ThemeColor.Fastpay);
            } else {
                this.updateColor(ThemeColor.Payroll);
            }
        });
    }

    updateColor(color: ThemeColor) {
        const inputs = this.inputString.toLowerCase().split('-');

        inputs.forEach(element => {
            switch (element) {
                case 'text':
                    this.renderer.setStyle(this.elementRef.nativeElement, 'color', color);
                    break;
                case 'background':
                    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', color);
                    break;
                case 'button':
                    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', color);
                    this.renderer.setStyle(this.elementRef.nativeElement, 'color', 'white');
                    break;
                default:
                    console.log('Invalid Theme Element');
                    break;
            }
        });
    }
}
