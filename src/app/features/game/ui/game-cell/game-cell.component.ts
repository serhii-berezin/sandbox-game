import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
} from '@angular/core';

export const GAME_CELL_MODE = {
    neutral: 0,
    clickable: 1,
    success: 2,
    fail: 3,
} as const;

export type GameCellMode = typeof GAME_CELL_MODE[keyof typeof GAME_CELL_MODE];


@Component({
  selector: 'button[appGameCell]',
  standalone: true,
  template: ``,
  styleUrls: ['./game-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCellComponent {
    @Input({ required: true }) mode!: GameCellMode;
    @Input() @HostBinding('style.width.px') size = 48;
    @HostBinding('class') get cssClass() {
        return Object.keys(GAME_CELL_MODE)[this.mode];
    }
}
