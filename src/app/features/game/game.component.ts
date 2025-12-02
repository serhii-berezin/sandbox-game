import {
    AsyncPipe,
    NgFor,
    NgIf,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    takeUntilDestroyed,
} from '@angular/core/rxjs-interop';
import {
    FormsModule,
} from '@angular/forms';
import {
    delay,
    Subject,
    tap,
} from 'rxjs';
import {
    ButtonComponent,
    InputComponent,
    PopupComponent,
} from '@ui';
import {
    GAME_CELL_MODE,
    GameCellComponent,
    type GameCellMode,
} from './ui';


const GAME_STATUS = {
    preStart: 0,
    process: 1,
    ended: 2,
} as const;

const PLAYERS = {
    player: 'player',
    computer: 'computer',
} as const;

type Player = keyof typeof PLAYERS;
type GameStatus = typeof GAME_STATUS[keyof typeof GAME_STATUS];


@Component({
    selector: 'app-game',
    standalone: true,
    imports: [
        AsyncPipe,
        NgFor,
        NgIf,
        FormsModule,
        ButtonComponent,
        GameCellComponent,
        InputComponent,
        PopupComponent,
    ],
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
    readonly #cdr = inject(ChangeDetectorRef);

    // At the moment, game renders square shape grid only
    @Input({ required: true }) size!: number;
    // Max amount of points to get win
    @Input() winScore = 10;

    #cells: GameCellMode[] = [];
    #showWinner = false;

    readonly cells$ = new Subject<void>();
    readonly delayStep = 300;
    readonly delayMin = 700;
    delay = this.delayMax - this.delayStep;
    gameStatus: GameStatus = GAME_STATUS.preStart;
    timestamp = 0;
    winner: Player | null = null;
    score: Record<Player, number> = {
        player: 0,
        computer: 0,
    };
    
    get cells() {
        return this.#cells;
    }

    get gameCellsCount() {
        return this.size**2;
    }

    get isGamePrestart() {
        return this.gameStatus === GAME_STATUS.preStart;
    }

    get isGameInProcess() {
        return this.gameStatus === GAME_STATUS.process;
    }

    get isGameEnded() {
        return this.gameStatus === GAME_STATUS.ended;
    }

    get isWinnerPopupShown() {
        return this.#showWinner;
    }

    get isHardGameMode() {
        return this.delay <= this.delayMin + this.delayStep;
    }

    get isNotMuchHardGameMode() {
        return !this.isHardGameMode && this.delay <= this.delayMin + (this.delayStep * 3);
    }

    get delayMax() {
        return this.delayMin + (this.delayStep * 5);
    }

    constructor() {
        this.cells$.asObservable()
            .pipe(
                delay(200),
                tap(() => {
                    this.timestamp = Date.now()
                    this.updateCell(
                        this.#getRandomAvailableIndex(), 
                        GAME_CELL_MODE.clickable,
                    )
                    this.#cdr.markForCheck()
                }),
                takeUntilDestroyed()
            )
            .subscribe()
    }

    ngOnInit(): void {
        this.resetCells();
    }

    resetCells() {
        this.#cells = this.#getDefaultCells();
    }

    updateCell(index: number, mode: GameCellMode) {
        this.#cells[index] = mode;
    }

    cellClicked(i: number, currentMode: GameCellMode) {
        if (currentMode === GAME_CELL_MODE.clickable) {
            const delta = Date.now() - this.timestamp;
            const isSuccess = delta <= this.delay;

            if (isSuccess) {
                this.updateCell(i, GAME_CELL_MODE.success);
                this.score.player += 1;
            } else {
                this.updateCell(i, GAME_CELL_MODE.fail);
                this.score.computer += 1;
            }

            this.winner = this.#checWinner();
            if (this.winner) {
                this.gameStatus = GAME_STATUS.ended;
                this.showWinnerPopup();
            } else {
                this.cells$.next();
            }
        }
    }

    start() {
        this.gameStatus = GAME_STATUS.process;
        this.cells$.next();
    }

    restart() {
        this.reset();
        this.start();
    }

    reset() {
        this.score.player = 0;
        this.score.computer = 0;
        this.showWinnerPopup(false);
        this.resetCells();
    }

    stop() {
        this.reset();
        this.gameStatus = GAME_STATUS.preStart;
    }

    showWinnerPopup(show = true) {
        this.#showWinner = show;
    }

    trackByFn(index: number, mode: GameCellMode) {
        return [index, mode].join('-');
    }

    #getDefaultCells() {
        return new Array(this.gameCellsCount).fill(GAME_CELL_MODE.neutral);
    }

    #getRandomAvailableIndex(): number {
        const availableCellsIndexes = this.#cells
            .map((mode, index) => (
                mode === GAME_CELL_MODE.neutral
                    ? index
                    : null
            ))
            .filter(cell => cell !== null);
        
        let index = Math.round(Math.random() * availableCellsIndexes.length) - 1;
        index = index < 0 ? 0 : index;
        return availableCellsIndexes[index];
    }

    #checWinner(): null | Player {
        const isPlayerWin = this.#cells.filter(cell => cell === GAME_CELL_MODE.success).length === this.winScore;
        const isComputerWin = this.#cells.filter(cell => cell === GAME_CELL_MODE.fail).length === this.winScore;
        return (isPlayerWin && PLAYERS.player) || (isComputerWin && PLAYERS.computer) || null;
    }
}
