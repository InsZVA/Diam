/**
 * Created by InsZVA on 2016/12/30.
 */
const E_NORMAL_WIDTH = 100;
const E_NORMAL_HEIGHT = 32;
// element state
const ES_NORMAL = 0;
const ES_SELECTED = 1;


function Diagram() {

}

function DiagramElement(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w || E_NORMAL_WIDTH;
    this.height = h || E_NORMAL_HEIGHT;
    this.state = ES_NORMAL;
    this.edit = null;
    this.text = "";
}

DiagramElement.prototype.render = function(ctx) {
    if (this.state == ES_NORMAL) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    } else if (this.state == ES_SELECTED) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);

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
    }

    ctx.fillStyle = "black";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height/2);
};

DiagramElement.prototype.posInSelectArea = function (x, y) {
    return x >= this.x && x <= this.x + this.width &&
            y >= this.y && y <= this.y + this.height;
};

DiagramElement.prototype.select = function () {
    this.state = ES_SELECTED;
    this.edit = document.createElement("input");
    this.edit.style.position = "absolute";
    this.edit.style.left = this.x + "px";
    this.edit.style.top = this.y + "px";
    this.edit.value = this.text;
    var e = this;
    this.edit.onblur = function () {
        e.text = this.value;
        document.body.removeChild(this);
        e.edit = null;
    };
    document.body.appendChild(this.edit);
    this.edit.focus();
    return this;
};

DiagramElement.prototype.unselect = function () {
    this.state = ES_NORMAL;
    if (this.edit)
        document.body.removeChild(this.edit);
    return this;
};

DiagramElement.prototype.delete = function () {

};

var ModuleElement = new DiagramElement();