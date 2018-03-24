import { Component, OnInit, OnDestroy } from '@angular/core';
import { MealsService, Meal } from '../../../shared/services/meals/meals.service';
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Store } from 'store';

@Component({
    selector: 'meals',
    styleUrls: ['meals.component.scss'],
    template: `
        <div class="meals">
            <div class="meals__title">
                <h1>
                    <img src="/img/food.svg">
                    Your meals
                </h1>
                <a
                    class="btn__add"
                    [routerLink]="['../meals/new']"
                 >
                    <img src="/img/add-white.svg">
                    New Meal
                 </a>
            </div>
            <div *ngIf="meals$ | async as meals; else loading;">
                <div class="message" *ngIf="!meals.length">
                    <img src="/img/face.svg">
                    No meals, add a meal to start!!
                </div>
                <list-item
                    (remove)="removeMeal($event)"
                    [item]="meal"
                    *ngFor="let meal of meals;"></list-item>
            </div>
            <ng-template #loading>
                <div class="message">
                    <img src="/img/loading.svg">
                    Fetching meals ...
                </div>
            </ng-template>
        </div>
    `
})

export class MealsComponent implements OnInit, OnDestroy{

    meals$: Observable<Meal[]>;
    subscription: Subscription;

    constructor(
        private mealsService: MealsService,
        private store: Store
    ) {}

    ngOnInit() {
        this.subscription = this.mealsService.$meals.subscribe();
        this.meals$ = this.store.select<Meal[]>('meals');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    removeMeal(event: Meal) {
        this.mealsService.removeMeal(event.$key);
    }
}

// We subscribe here to meals$ and this initiates the data flow in the service.
// Therefore making the component incharge of dataflow.
// The subscription is destroyed since called in ngOndestory and it's a routed component.
// When component is initialized the the meals observable is going to kick off a request to
//   look for meals and return an observable stream.