import {cold, hot, Scheduler, time} from '../index';
import {concat, merge, mapTo} from 'rxjs/operators';
import {timer} from 'rxjs/observable/timer';

describe('toBeObservable matcher test', () => {
    it('Should concatenate two cold observables into single cold observable', () => {
        const a$ = cold('-a-|', {a: 0});
        const b$ = cold('-b-|', {b: 1});
        const expected = cold('-a--b-|', {a: 0, b:1});

        expect(a$.pipe(concat(b$))).toBeObservable(expected);
    });

    it('Should merge two hot observables and start emitting from the subscription point', () => {
        const e1 = hot('----a--^--b-------c--|', {a: 0});
        const e2 = hot(  '---d-^--e---------f-----|', {a: 0});
        const expected = cold('---(be)----c-f-----|', {a: 0});

        expect(e1.pipe(merge(e2))).toBeObservable(expected);
    });

    it('Should delay the emission by provided timeout with provided scheduler', () => {

        const delay = time('-----d|');
        const provided = timer(delay, Scheduler.get()).pipe(mapTo(0));

        const expected = hot('------(d|)', {d: 0});

        expect(provided).toBeObservable(expected);
    });

});
