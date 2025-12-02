import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';
import {
    GameComponent,
} from './features/game';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [GameComponent],
    template: '<app-game [size]="10" />',
    styles: `
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
