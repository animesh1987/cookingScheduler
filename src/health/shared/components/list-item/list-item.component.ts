import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Meal } from "../../services/meals/meals.service";

@Component({
    selector: 'list-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['list-item.component.scss'],
    template: `
        <div class="list-item">
            <a
                [routerLink]="getRoute(item)">
                <p class="list-item__name">{{ item.name }}</p>
                <p class="list-item__ingredients">
                    <span *ngIf="item.ingredients; else showWorkout">
                        {{ item.ingredients | join }}
                     </span>
                </p>
                <ng-template #showWorkout>
                    <span>{{ item | workout }}</span>
                </ng-template>
            </a>

            <div *ngIf="toggled"
                class="list-item__delete">
                <p>Delete Item?</p>
                <button class="confirm"
                    (click)="removeItem()"
                    type="button">
                    Yes
                </button>
                <button class="cancel"
                    (click)="toggle()"
                    type="button">
                    No
                </button>
            </div>

            <button class="trash"
                type="button"
                (click)="toggle()">
                <img src="/img/remove.svg">

            </button>
        </div>
    `
})

export class ListItemComponent {

    toggled: boolean = false;

    @Input()
    item: Meal|any;

    @Output()
    remove = new EventEmitter<Meal|any>()

    constructor() {}

    getRoute(item: any) {
        return [
            `../${item.ingredients ? 'meals' : 'workouts'}`,
            item.$key
        ];
    }

    removeItem() {
        this.remove.emit(this.item);
    }

    toggle() {
        this.toggled = !this.toggled;
    }
}