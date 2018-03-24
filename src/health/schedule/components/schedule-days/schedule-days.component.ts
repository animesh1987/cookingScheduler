import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'schedule-days',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['schedule-days.component.scss'],
    template: `
        <div class="days">
            <button
                type="button"
                *ngFor="let day of days; index as i;"
                (click)="selectDay(i)"
                class="day">
                <span [class.active]="selected === i">{{ day }}</span>
            </button>
        </div>
    `
})

export class ScheduleDaysComponent {

    days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    @Input()
    selected: number;

    @Output()
    select = new EventEmitter<number>();

    selectDay(index: number) {
        this.select.emit(index);
    }
}