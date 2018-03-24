import 'rxjs/add/operator/do';import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";

import { Store } from 'store';
import { AuthService } from "../../../../auth/shared/service/auth/auth.service";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';

export interface Meal {
    name: string,
    ingredients: string[],
    timestamp: number,
    $key: string,
    $exists: () => boolean
}

@Injectable()
export class MealsService {

    $meals: Observable<Meal[]> = this.db.list(`meals/${this.uid}`)
        .do(next => this.store.set('meals', next));

    constructor(
        private store: Store,
        private db: AngularFireDatabase,
        private authService: AuthService
    ) {}

    get uid() {
        return this.authService.user.uid;
    }

    addMeal(meal: Meal) {
        return this.db.list(`meals/${this.uid}`).push(meal);
    }

    updateMeal(key: string, meal: Meal) {
        return this.db.object(`meals/${this.uid}/${key}`).update(meal);
    }

    removeMeal(key: string) {
        return this.db.list(`meals/${this.uid}`).remove(key);
    }

    getMeal(key: string) {
        if(!key) return Observable.of({});
        // Filter here checks if there is any data returned from the store.
        return this.store.select<Meal[]>('meals')
            .filter(Boolean)
            .map(meals => meals.find((meal: Meal) => meal.$key === key));
    }

}