import Sides from './Sides';
import { getRandomInt } from '../../../../services/randomService.js';

export default class Barrier {
    constructor(index) {
        this.topPosition = 0;
        this.side = Sides.LEFT;
        this.key = index;
        this.width = 0;
        this.visible = false;
        this.style = "";

        this.setRandomSideAndWidth();
        this.calculateStyle();
    }

    // getRandomInt(min, max) {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }

    setRandomSideAndWidth() {
        this.width = getRandomInt(50, 400);
        
        this.side = getRandomInt(0, 1);
    }

    calculateStyle() {
        var barrierStyle = {};

        this.setSidePosition(this, barrierStyle);

        barrierStyle.top = this.topPosition
        barrierStyle.width = this.width;

        if (this.visible === false) {
            barrierStyle.display = 'none';
        }
        else {
            barrierStyle.display = 'initial';
        }

        this.style = barrierStyle;
    }

    setSidePosition(barrier, barrierStyle) {
        switch (barrier.side) {
            case Sides.LEFT:
                barrierStyle.left = 0;
                break;
            case Sides.RIGHT:
                barrierStyle.right = 0;
                break;
        }
    }
}
