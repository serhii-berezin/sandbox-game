import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';

@Component({
    selector: 'app-popup',
    standalone: true,
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent {
}
