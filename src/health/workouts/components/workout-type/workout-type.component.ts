import { Component, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const TYPE_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WorkoutTypeComponent),
    multi: true
};

@Component({
    selector: 'workout-type',
    providers: [TYPE_CONTROL_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./workout-type.component.scss'],
    template: `
        <div class="workout-type">
            <div class="workout-type__pane"
                *ngFor="let selector of selectors;"
                (click)="setSelected(selector)"
                [class.active]="selector === value">
                <img src="./img/{{ selector }}.svg">
                <p>{{ selector }}</p>
            </div>
        </div>
    `
})

export class WorkoutTypeComponent implements ControlValueAccessor{

    selectors = ['strength', 'endurance'];

    value: string;

    private onTouch: Function;
    private onModelChange: Function;

    // When the component is touched.
    registerOnTouched(fn: Function) {
        this.onTouch = fn;
    }

    // When a value actually changes in the component.
    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    // The value that comes from parent component.
    writeValue(value: string) {
        this.value = value;
    }

    setSelected(value: string) {
        this.value = value;
        this.onModelChange(value);
        this.onTouch();
    }
}