/**
 * Created by InsZVA on 2016/12/30.
 */
// Brush Icon
const BI_WIDTH = 25;
const BI_HEIGHT = 25;
// Brush State
const BS_NORMAL = 0;
const BS_SELECTED = 1;

function BaseBrush(ix, iy) {
    this.iconX = ix;
    this.iconY = iy;
    this.state = BS_NORMAL;
    this.element = DiagramElement;
}

BaseBrush.prototype.renderIcon = function(ctx) {
    if (this.state == BS_NORMAL) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.iconX, this.iconY, BI_WIDTH, BI_HEIGHT);
    } else if (this.state == BS_SELECTED) {
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.iconX, this.iconY, BI_WIDTH, BI_HEIGHT);
    }
};

BaseBrush.prototype.select = function () {
    this.state = BS_SELECTED;
    return this;
};

BaseBrush.prototype.unselect = function () {
    this.state = BS_NORMAL;
    return this;
};

function ModuleBrush(ix, iy) {
    BaseBrush.call(this, ix, iy);
}

ModuleBrush.prototype = new BaseBrush();
ModuleBrush.prototype.constructor = ModuleBrush;