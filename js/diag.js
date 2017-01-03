/**
 * Created by InsZVA on 2016/12/30.
 */
const E_NORMAL_WIDTH = 100;
const E_NORMAL_HEIGHT = 32;
// element state
const ES_NORMAL = 0;
const ES_SELECTED = 1;
const ES_RESIZING = 2;
// element resize
const ER_NONE = 0;
const ER_MOVE = 1;
const ER_NW = 2;
const ER_NE = 3;
const ER_SW = 4;
const ER_SE = 5;
const ER_CURSOR = ['default', 'move', 'nw-resize', 'ne-resize', 'sw-resize', 'se-resize'];
// element arrow
const EA_NONE = 0;
const EA_N = 1;
const EA_S = 2;
const EA_W = 3;
const EA_E = 4;

function Diagram() {

}

function DiagramElement(ws, x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w || E_NORMAL_WIDTH;
    this.height = h || E_NORMAL_HEIGHT;
    this.state = ES_NORMAL;
    this.edit = null;
    this.text = "";
    this.ws = ws; // the workspace this belongs to
    this.resize = ER_NONE;
    this.resizeX = 0; // when the resize begin, the x
    this.resizeY = 0;
}

DiagramElement.prototype.render = function(ctx) {
    if (this.state == ES_NORMAL) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    } else if (this.state == ES_SELECTED) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        this.renderCircle(ctx);
    }

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height/2);
};

DiagramElement.prototype.renderCircle = function (ctx) {
    //LT
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();

    //T
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();

    //RT
    ctx.beginPath();
    ctx.arc(this.x + this.width, this.y, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();

    //L
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.height / 2, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();

    //R
    ctx.beginPath();
    ctx.arc(this.x + this.width, this.y + this.height / 2, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();

    //LB
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.height, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();

    //B
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();

    //RB
    ctx.beginPath();
    ctx.arc(this.x + this.width, this.y + this.height, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
};

DiagramElement.prototype.posInSelectArea = function (x, y) {
    return x >= this.x && x <= this.x + this.width &&
            y >= this.y && y <= this.y + this.height;
};

DiagramElement.prototype.startEdit = function () {
    this.edit = document.createElement("input");
    this.edit.style.position = "absolute";
    this.edit.style.left = (this.x + this.ws.canvas.offsetLeft) + "px";
    this.edit.style.top = (this.y + this.ws.canvas.offsetTop) + "px";
    this.edit.style.height = (this.height - 6) + "px";
    this.edit.style.width = (this.width - 6) + "px";
    this.edit.style.margin = "3px";
    this.edit.style.padding = "0px";
    this.edit.style.border = "0";
    this.edit.style.textAlign = "center";
    this.edit.value = this.text;
    this.edit.onblur = function () {
        this.endEdit();
    }.bind(this);
    this.ws.canvas.parentNode.appendChild(this.edit);
    this.edit.focus();
};

DiagramElement.prototype.endEdit = function () {
    if (this.edit) {
        this.text = this.edit.value;
        this.ws.canvas.parentNode.removeChild(this.edit);
        this.edit = null;
    }
};

DiagramElement.prototype.select = function () {
    this.state = ES_SELECTED;
    this.startEdit();
    return this;
};

DiagramElement.prototype.unselect = function () {
    this.state = ES_NORMAL;
    this.endEdit();
    return this;
};

DiagramElement.prototype.delete = function () {

};

DiagramElement.prototype.pointEArrow = function (x, y) {
    return Math.abs(x - this.x - this.width) < 4 &&
            Math.abs(y - this.y - this.height / 2) < 4;
};

DiagramElement.prototype.pointWArrow = function (x, y) {
    return Math.abs(x - this.x) < 4 &&
        Math.abs(y - this.y - this.height / 2) < 4;
};

DiagramElement.prototype.pointNArrow = function (x, y) {
    return Math.abs(x - this.x - this.width / 2) < 4 &&
        Math.abs(y - this.y) < 4;
};

DiagramElement.prototype.pointSArrow = function (x, y) {
    return Math.abs(x - this.x - this.width / 2) < 4 &&
        Math.abs(y - this.y - this.height) < 4;
};

DiagramElement.prototype.pointNWResize = function (x, y) {
    return Math.abs(x - this.x) < 4 &&
        Math.abs(y - this.y) < 4;
};

DiagramElement.prototype.pointNEResize = function (x, y) {
    return Math.abs(x - this.x - this.width) < 4 &&
        Math.abs(y - this.y) < 4;
};

DiagramElement.prototype.pointSWResize = function (x, y) {
    return Math.abs(x - this.x) < 4 &&
        Math.abs(y - this.y - this.height) < 4;
};

DiagramElement.prototype.pointSEResize = function (x, y) {
    return Math.abs(x - this.x - this.width) < 4 &&
        Math.abs(y - this.y - this.height) < 4;
};

DiagramElement.prototype.pointFrame = function (x, y) {
    return Math.abs(x - this.x) < 3 && y > this.y && y < this.y + this.height ||
            Math.abs(x - this.x - this.width) < 3 && y > this.y && y < this.y + this.height ||
            Math.abs(y - this.y) < 3 && x > this.x && x < this.x + this.width ||
            Math.abs(y - this.y - this.height) < 3 && x > this.x && x < this.x + this.width;
};

DiagramElement.prototype.pointResize = function (x, y) {
    if (this.pointArrow(x, y) != EA_NONE) return ER_NONE;
    if (this.pointNWResize(x, y)) return ER_NW;
    if (this.pointNEResize(x, y)) return ER_NE;
    if (this.pointSWResize(x, y)) return ER_SW;
    if (this.pointSEResize(x, y)) return ER_SE;
    if (this.pointFrame(x, y)) return ER_MOVE;
    return ER_NONE;
};

DiagramElement.prototype.pointArrow = function (x, y) {
    if (this.pointNArrow(x, y)) return EA_N;
    if (this.pointSArrow(x, y)) return EA_S;
    if (this.pointWArrow(x, y)) return EA_W;
    if (this.pointEArrow(x, y)) return EA_E;
    return EA_NONE;
};

DiagramElement.prototype.cursor = function (x, y) {
    var er = this.pointResize(x, y);
    if (er != ER_NONE)
        return ER_CURSOR[er];
    else
        return (this.pointArrow(x, y) == EA_NONE) ? "default" : "crosshair";
};

DiagramElement.prototype.startResize = function (x, y) {
    this.resize = this.pointResize(x, y);
    if (this.resize == ER_NONE) return false;
    this.resizeX = x;
    this.resizeY = y;
    this.state = ES_RESIZING;
    return true;
};

DiagramElement.prototype.doResize = function (x, y) {
    switch (this.resize) {
        case ER_NE:
            this.width = x - this.x;
            this.height += this.y - y;
            this.y = y;
            break;
        case ER_NW:
            this.width += this.x - x;
            this.x = x;
            this.height += this.y - y;
            this.y = y;
            break;
        case ER_SW:
            this.width += this.x - x;
            this.x = x;
            this.height = y - this.y;
            break;
        case ER_SE:
            this.width = x - this.x;
            this.height = y - this.y;
            break;
        case ER_MOVE:
            this.x = this.x + (x - this.resizeX);
            this.y = this.y + (y - this.resizeY);
            this.resizeX = x;
            this.resizeY = y;
            break;
    }
};

DiagramElement.prototype.resizing = function (x, y) {
    if (this.state != ES_RESIZING) return;
    this.doResize(x, y);
};

DiagramElement.prototype.endResize = function (x, y) {
    this.state = ES_SELECTED;
    this.resize = ER_NONE;
};

DiagramElement.prototype.getSPoint = function () {
    return {
        x: this.x + this.width / 2,
        y: this.y + this.height
    }
};

DiagramElement.prototype.getNPoint = function () {
    return {
        x: this.x + this.width / 2,
        y: this.y
    }
};

DiagramElement.prototype.getWPoint = function () {
    return {
        x: this.x,
        y: this.y + this.height / 2
    }
};

DiagramElement.prototype.getEPoint = function () {
    return {
        x: this.x + this.width,
        y: this.y + this.height / 2
    }
};

var ModuleElement = new DiagramElement();