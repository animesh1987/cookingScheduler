import 'rxjs/add/operator/do';import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";

import { Store } from 'store';
import { AuthService } from "../../../../auth/shared/service/auth/auth.service";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';

export interface Workout {
    name: string,
    type: string,
    strength: string,
    endurance: string,
    timestamp: number,
    $key: string,
    $exists: () => boolean
}

@Injectable()
export class WorkoutsService {

    $workouts: Observable<Workout[]> = this.db.list(`workouts/${this.uid}`)
        .do(next => this.store.set('workouts', next));

    constructor(
        private store: Store,
        private db: AngularFireDatabase,
        private authService: AuthService
    ) {}

    get uid() {
        return this.authService.user.uid;
    }

    addWorkout(workout: Workout) {
        return this.db.list(`workouts/${this.uid}`).push(workout);
    }

    updateWorkout(key: string, workout: Workout) {
        return this.db.object(`workouts/${this.uid}/${key}`).update(workout);
    }

    removeWorkout(key: string) {
        return this.db.list(`workouts/${this.uid}`).remove(key);
    }

    getWorkout(key: string) {
        if(!key) return Observable.of({});
        // Filter here checks if there is any data returned from the store.
        return this.store.select<Workout[]>('workouts')
            .filter(Boolean)
            .map(workouts => workouts.find((workout: Workout) => workout.$key === key));
    }

}