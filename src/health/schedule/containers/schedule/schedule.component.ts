import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from 'store';

import { ScheduleService, ScheduleItem } from '../../../shared/services/schedule/schedule.service'
import { Meal, MealsService } from "../../../shared/services/meals/meals.service";
import { Workout, WorkoutsService } from "../../../shared/services/workouts/workouts.service";

@Component({
    selector: 'schedule',
    styleUrls: ['schedule.component.scss'],
    template: `
        <div class="schedule">
            <schedule-calendar
                (select)="changeSection($event)"
                (change)="changeDate($event)"
                [items]="schedule$ | async"
                [date]="date$ | async">
            </schedule-calendar>

            <schedule-assign
                *ngIf="open"
                (update)="assignItem($event)"
                (cancel)="closeAssign()"
                [section]="selected$ | async"
                [list]="list$ | async">
            </schedule-assign>
        </div>
    `
})

export class ScheduleComponent implements OnDestroy, OnInit{

    open = false;

    date$: Observable<Date>;
    selected$: Observable<any>;
    schedule$: Observable<ScheduleItem[]>;
    list$: Observable<Meal[] | Workout[]>;
    subscriptions: Subscription[] = [];

    constructor(
        private store: Store,
        private scheduleService: ScheduleService,
        private mealService: MealsService,
        private workoutsService: WorkoutsService
    ) {}

    changeDate(date: Date) {
        this.scheduleService.updateDate(date);
    }

    changeSection(event: any) {
        this.open = true;
        this.scheduleService.selectSection(event);
    }

    ngOnInit() {
        this.date$ = this.store.select('date');
        this.schedule$ = this.store.select('schedule');
        this.selected$ = this.store.select('selected');
        this.list$ = this.store.select('list');
        this.subscriptions = [
            this.scheduleService.schedule$.subscribe(),
            this.scheduleService.selected$.subscribe(),
            this.scheduleService.list$.subscribe(),
            this.scheduleService.items$.subscribe(),
            this.mealService.$meals.subscribe(),
            this.workoutsService.$workouts.subscribe()
        ];
    }

    assignItem(items: string[]) {
        this.closeAssign();
        this.scheduleService.updateItems(items);
    }

    closeAssign() {
        this.open = false;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}