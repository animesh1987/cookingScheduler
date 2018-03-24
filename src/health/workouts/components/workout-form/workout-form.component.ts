import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Workout } from "../../../shared/services/workouts/workouts.service";

@Component({
    selector: 'workout-form',
    changeDetection: ChangeDetectionStrategy.OnPush, // Makes application faster.
    styleUrls: ['workout-form.component.scss'],
    template: `
        <div class="workout-form">
            <form [formGroup]="form">
                <div class="workout-form__name">
                    <label>
                        <h3>Workout name</h3>
                        <input type="text"
                            formControlName="name"
                            [placeholder]="placeholder">
                        <div class="error" *ngIf="required">
                            Workout name is required
                        </div>
                    </label>
                    <label>
                        <h3>Type</h3>
                        <workout-type
                            formControlName="type">
                        </workout-type>
                        <div class="error" *ngIf="required">
                            Workout name is required
                        </div>
                    </label>
                </div>

                <div class="workout-form__details">
                    <div *ngIf="form.get('type').value === 'strength'">
                        <div class="workout-form__fields"
                            formGroupName="strength">
                            <label>
                                <h3>Reps</h3>
                                <input type="number" formControlName="reps">
                            </label>
                            <label>
                                <h3>Sets</h3>
                                <input type="number" formControlName="sets">
                            </label>
                            <label>
                                <h3>Weight <span>(kg)</span></h3>
                                <input type="number" formControlName="weight">
                            </label>
                        </div>
                    </div>

                    <div *ngIf="form.get('type').value === 'endurance'">
                        <div class="workout-form__fields"
                            formGroupName="endurance">
                            <label>
                                <h3>Distance <span>(Km)</span></h3>
                                <input type="number" formControlName="distance">
                            </label>
                            <label>
                                <h3>Duration <span>(minutes)</span></h3>
                                <input type="number" formControlName="duration">
                            </label>
                        </div>
                    </div>
                </div>

                <div class="workout-form__submit">
                    <div>
                        <button type="button" *ngIf="!exists"
                            class="button"
                            (click)="createWorkout()">
                            Create Workout
                        </button>
                        <button type="button" *ngIf="exists"
                            class="button"
                            (click)="updateWorkout()">
                            Save
                        </button>
                        <!--../ takes used back to where they came from-->
                        <a
                            [routerLink]="['../']"
                            class="button button--cancel">
                            Cancel
                        </a>
                    </div>

                    <div class="workout-form__delete" *ngIf="exists">
                        <div *ngIf="toggled">
                            <p>Delete Item?</p>
                            <button class="confirm"
                                (click)="removeWorkout()"
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

export class WorkoutFormComponent implements OnChanges {

    exists = false;

    toggled = false;

    @Input()
    workout: Workout;

    @Output()
    create = new EventEmitter<Workout>();

    @Output()
    update = new EventEmitter<Workout>();

    @Output()
    remove = new EventEmitter<Workout>();

    form = this.fb.group({
        name: ['', Validators.required],
        type: ['strength', Validators.required],
        strength: this.fb.group({
            reps: 0,
            sets: 0,
            weight: 0
        }),
        endurance: this.fb.group({
            distance: 0,
            duration: 0
        })
    });

    ngOnChanges(changes: SimpleChanges) {
        if (this.workout && this.workout.name) {
            this.exists = true;
        }

        const value = this.workout;
        // patch value, patches the returned value to the form.
        this.form.patchValue(value);
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

    get placeholder() {
        return `e.g. ${this.form.get('type').value === 'strength' ? 'Benchpress' : 'Treadmill'}`;
    }

    createWorkout() {
        if(this.form.valid) {
            this.create.emit(this.form.value);
        }
    }

    updateWorkout() {
        if(this.form.valid) {
            this.update.emit(this.form.value);
        }
    }

    removeWorkout() {
        this.remove.emit(this.form.value);
    }

    toggle() {
        this.toggled = !this.toggled;
    }
}
