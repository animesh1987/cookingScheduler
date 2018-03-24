import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Meal } from "../../../shared/services/meals/meals.service";
import { Workout } from "../../../shared/services/workouts/workouts.service";

@Component({
    selector: 'schedule-assign',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./schedule-assign.component.scss'],
    template: `
        <div class="schedule-assign">
            <div class="schedule-assign__modal">
                <div class="schedule-assign__title">
                    <h1>
                        <img src="/img/{{section.type === 'workouts'? 'workout' : 'food'}}.svg">
                        Assign {{ section.type }}
                    </h1>
                    <a
                        [routerLink]="getRoute(section.type)"
                        class="btn__add">
                        <img src="/img/add-white.svg">
                        New {{ section.type }}
                    </a>
                </div>

                <div class="schedule-assign__list">
                    <span
                        *ngIf="!list?.length"
                        class="schedule-assign__empty">
                            <img src="/img/face.svg">
                    </span>

                    <div
                        [class.active]="exists(item.name)"
                        (click)="toggleItem(item.name)"
                        *ngFor="let item of list;">
                            {{ item.name }}
                    </div>
                </div>

                <div class="schedule-assign__submit">
                    <div>
                        <button type="button" class="button" (click)="updateAssign()">
                            Update
                        </button>

                        <button type="button--cancel" class="button" (click)="cancelAssign()">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class ScheduleAssignComponent implements OnInit {

    private selected: string[] = [];

    @Input()
    section: any;

    @Input()
    list: Workout[] | Meal[];

    @Output()
    update = new EventEmitter<any>();

    @Output()
    cancel = new EventEmitter<any>();

    getRoute(name: string) {
        return [`../${name}/new`];
    }

    ngOnInit() {
        this.selected = [...this.section.assigned];
    }

    exists(name: string) {
        return !!~this.selected.indexOf(name);
    }

    toggleItem(name: string) {
        if (this.exists(name)) {
            this.selected = this.selected.filter(
                item => item !== name)
        } else {
            this.selected = [...this.selected, name];
        }
    }

    updateAssign() {
        this.update.emit({
            [this.section.type]: this.selected
        });
    }

    cancelAssign() {
        this.cancel.emit();
    }

}