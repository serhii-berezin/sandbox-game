import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'input[appInput]',
    standalone: true,
    template: ``,
    styles: `
        input[appInput] {
            height: 42px;
            padding: 0 16px;
            border: 1px solid rgba(0,0,0, .5);
            border-radius: 4px;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class InputComponent {

}
