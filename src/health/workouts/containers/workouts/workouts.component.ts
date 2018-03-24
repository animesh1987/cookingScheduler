import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutsService, Workout } from '../../../shared/services/workouts/workouts.service';
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Store } from 'store';

@Component({
    selector: 'workouts',
    styleUrls: ['workouts.component.scss'],
    template: `
        <div class="workouts">
            <div class="workouts__title">
                <h1>
                    <img src="/img/workout.svg">
                    Your Workouts
                </h1>
                <a
                    class="btn__add"
                    [routerLink]="['../workouts/new']"
                 >
                    <img src="/img/add-white.svg">
                    New Workout
                 </a>
            </div>
            <div *ngIf="workouts$ | async as workouts; else loading;">
                <div class="message" *ngIf="!workouts.length">
                    <img src="/img/face.svg">
                    No workouts, add a meal to start!!
                </div>
                <list-item
                    (remove)="removeWorkout($event)"
                    [item]="meal"
                    *ngFor="let meal of workouts;"></list-item>
            </div>
            <ng-template #loading>
                <div class="message">
                    <img src="/img/loading.svg">
                    Fetching workouts ...
                </div>
            </ng-template>
        </div>
    `
})

export class WorkoutsComponent implements OnInit, OnDestroy{

    workouts$: Observable<Workout[]>;
    subscription: Subscription;

    constructor(
        private workoutsService: WorkoutsService,
        private store: Store
    ) {}

    ngOnInit() {
        this.subscription = this.workoutsService.$workouts.subscribe();
        this.workouts$ = this.store.select<Workout[]>('workouts');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    removeWorkout(event: Workout) {
        this.workoutsService.removeWorkout(event.$key);
    }
}

// We subscribe here to workouts$ and this initiates the data flow in the service.
// Therefore making the component incharge of dataflow.
// The subscription is destroyed since called in ngOndestory and it's a routed component.
// When component is initialized the the workouts observable is going to kick off a request to
//   look for workouts and return an observable stream.