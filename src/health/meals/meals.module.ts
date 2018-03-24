import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Containers.
import { MealsComponent } from './containers/meals/meals.component';
import { MealComponent } from './containers/meal/meal.component';

// Components.
import { MealFormComponent } from './components/meal-form/meal-form.component';

import { SharedModule } from '../shared/shared.module';

export const ROUTES: Routes = [
    { path: '', component: MealsComponent},
    { path: 'new', component: MealComponent},
    { path: ':id', component: MealComponent}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        ReactiveFormsModule,
        SharedModule // No forRoot here as already declared for root in parent health module.
    ],
    declarations: [
        MealsComponent,
        MealComponent,
        MealFormComponent
    ]
})

export class MealsModule {}