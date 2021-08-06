import { Injectable } from '@angular/core';
import { View } from 'tns-core-modules/ui/page/page';


export interface AnimationRange {
    from: number;
    to: number;
}

export interface JsAnimationDefinition {
    getRange: () => AnimationRange;
    curve(progress: number): number;
    step(deltaResult): void;
}

@Injectable({ providedIn: 'root' })
export class AnimationHelper {

    constructor() { }

    /**
     * Used for a unseen view to slide in.
     * Call this on the loaded function of a view for it to slide in vertically.
     * @param view - View object.
     * @param slideInIndex - Slide in index. (How fast you want it to slide in)
     * @param duration - how long the animation is *Default is 300ms*
     */
    slideInto(view: View, slideInIndex: number, direction: 'left' | 'right' | 'up' | 'down' = 'up', duration: number = 300) {
        view.visibility = 'collapse';

        if (slideInIndex === undefined) {
            view.visibility = 'visible';
            return;
        }

        if (slideInIndex <= 5) {
            duration = duration + (slideInIndex * 100);
        }

        const location = this.getXY(direction);

        view.translateX = location.x;
        view.translateY = -location.y;

        view.visibility = 'visible';

        view.animate({
            translate: { x: 0, y: 0 },
            duration: duration,
            opacity: 1
        }).catch(() => {
            console.log('Animation canceled.');
        });
    }

    /**
     * Used for a view to slide away from UI.
     * Call this on the unloaded function of a view for it to slide out vertically.
     * @param view - View object.
     * @param direction - The direction of thee animation. *Default is Up*
     * @param duration - how long the animation is *Default is 300ms*
     */
    slideAway(view: View, direction: 'left' | 'right' | 'up' | 'down' = 'up', duration: number = 300) {
        view.animate({
            translate: this.getXY(direction),
            duration: duration,
            opacity: 1
        }).catch(() => {
            console.log('Animation canceled.');
        });
    }

    slideBack(view: View, duration: number = 300) {
        view.animate({
            translate: { x: 0, y: 0 },
            duration: duration,
            opacity: 1
        }).catch(() => {
            console.log('Animation canceled.');
        });
    }

    /**
     * Call this on the loaded function of a view for it to fade out.
     * @param view - View object.
     */
    fadeOut(view: View) {
        view.opacity = 0;

        view.animate({
            opacity: 1,
            duration: 500
        }).catch(() => {
            console.log('Animation canceled.');
        });
    }

    private getXY(direction: 'left' | 'right' | 'up' | 'down'): { x: number, y: number } {
        let x = 0;
        let y = 0;

        switch (direction) {
            case 'left':
                x = -500;
                break;
            case 'right':
                x = 500;
                break;
            case 'up':
                y = -500;
                break;
            case 'down':
                y = 500;
                break;
        }

        return { x: x, y: y};
    }
}

export function amountFromTo(range: AnimationRange) {
    return (t: number) => {
        const ret = range.from + t * (range.to - range.from);
        return ret;
    };
}

export function animate(duration: number, defs: JsAnimationDefinition[]) {

    return new Promise((resolve) => {
        const start = new Date();

        const timerId = setInterval(() => {
            const timePassed = new Date().valueOf() - start.valueOf();

            let progress = timePassed / duration;
            if (progress > 1) {
                progress = 1;
            }

            for (let i = 0; i < defs.length; i++) {
                const def = defs[i];

                const delta = def.curve(progress);
                const v = amountFromTo(def.getRange())(delta);

                def.step(v);
            }

            if (progress === 1) {
                clearInterval(timerId);
                resolve();
            }
        }, 17);
    });
}
