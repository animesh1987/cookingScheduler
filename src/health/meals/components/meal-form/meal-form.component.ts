import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {Meal} from "../../../shared/services/meals/meals.service";

@Component({
    selector: 'meal-form',
    changeDetection: ChangeDetectionStrategy.OnPush, // Makes application faster.
    styleUrls: ['meal-form.component.scss'],
    template: `
        <div class="meal-form">
            <form [formGroup]="form">
                <div class="meal-form__name">
                    <label>
                        <h3>Meal Name</h3>
                        <input type="text"
                            formControlName="name"
                            placeholder="e.g. English Breakfast">
                        <div class="error" *ngIf="required">
                            Meal name is required
                        </div>
                    </label>
                </div>

                <div class="meal-form__food">
                    <div class="meal-form__subtitle">
                        <h3>Food</h3>
                        <button
                            (click)="addIngredient()"
                            type="button"
                            class="meal-form__add">
                            <img src="/img/add-white.svg">
                            Add Food
                        </button>
                    </div>
                    <div formArrayName="ingredients">
                        <label *ngFor="let c of ingredients.controls; index as i;">
                            <!--[formControlName] like this as it's a property binding
                                compared to string binding.
                            -->
                            <input type="text"
                                [formControlName]="i"
                                placeholder="e.g. Eggs">
                            <span class="meal-form__remove"
                                (click)="removeIngredient(i)"></span>
                        </label>
                    </div>
                </div>

                <div class="meal-form__submit">
                    <div>
                        <button type="button"  *ngIf="!exists"
                            class="button"
                            (click)="createMeal()">
                            Create Meal
                        </button>
                        <button type="button" *ngIf="exists"
                            class="button"
                            (click)="updateMeal()">
                            Save
                        </button>
                        <!--../ takes used back to where they came from-->
                        <a
                            [routerLink]="['../']"
                            class="button button--cancel">
                            Cancel
                        </a>
                    </div>

                    <div class="meal-form__delete" *ngIf="exists">
                        <div *ngIf="toggled">
                            <p>Delete Item?</p>
                            <button class="confirm"
                                (click)="removeMeal()"
                                type="button">
                                Yes
                            </button>
                            <button class="cancel"
                                (click)="toggle()"
                                type="button">
                                No
                            </button>
                        </div>

                        <button class="button button--delete"
                            type="button"
                            (click)="toggle()">
                            Delete
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `
})

export class MealFormComponent implements OnChanges {

    exists = false;

    toggled = false;

    @Input()
    meal: Meal;

    @Output()
    create = new EventEmitter<Meal>();

    @Output()
    update = new EventEmitter<Meal>();

    @Output()
    remove = new EventEmitter<Meal>();

    form = this.fb.group({
        name: ['', Validators.required],
        ingredients: this.fb.array([''])
    });

    ngOnChanges(changes: SimpleChanges) {
        if (this.meal && this.meal.name) {
            this.exists = true;
            /*Need to empty ingredients and readd as form controls workaround for a quirk in angular*/
            this.emptyIngredients();

            const value = this.meal;
            this.form.patchValue(value);

            if (value.ingredients) {
                for (const item of value.ingredients) {
                    this.ingredients.push(new FormControl(item));
                }
            }
        }
    }

    emptyIngredients() {
        while(this.ingredients.controls.length) {
            this.ingredients.removeAt(0);
        }
    }

    constructor(
        private fb: FormBuilder
    ) {}

    get required() {
        return(
            this.form.get('name').hasError('required') &&
                this.form.get('name').touched
        );
    }

    get ingredients() {
        return this.form.get('ingredients') as FormArray;
    }

    createMeal() {
        if(this.form.valid) {
            this.create.emit(this.form.value);
        }
    }

    updateMeal() {
        if(this.form.valid) {
            this.update.emit(this.form.value);
        }
    }

    removeMeal() {
        this.remove.emit(this.form.value);
    }

    addIngredient() {
        this.ingredients.push(new FormControl(''));
    }

    removeIngredient(index: number) {
        this.ingredients.removeAt(index);
    }

    toggle() {
        this.toggled = !this.toggled;
    }
}
