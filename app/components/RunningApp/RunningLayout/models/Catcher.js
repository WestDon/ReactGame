import Sides from './Sides';

export default class Catcher {
    constructor(index) {
        this.visible = false;
        this.style = "";
        
        this.left = 0;
        this.top = 0;

        this.calculateStyle();
    }



    calculateStyle() {
        var catcherStyle = {};

        catcherStyle.top = this.top;
        catcherStyle.left = this.left;

        if (this.visible === false) {
            catcherStyle.display = 'none';
        }
        else {
            catcherStyle.display = 'initial';
        }

        this.style = catcherStyle;
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