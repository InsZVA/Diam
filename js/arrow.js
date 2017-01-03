/**
 * Created by InsZVA on 2017/1/3.
 */
// arrow style
const AS_ARROW = 0;
const AS_LINE = 1;

function BaseArrow(startElem, endElem, startPos, endPos, style) {
    this.startElem = startElem;
    this.endElem = endElem;
    this.startPos = startPos;
    this.endPos = endPos;
    this.style = style ? style : AS_ARROW;
}

BaseArrow.prototype.render = function (ctx) {
    var startP = this.startPos.call(this.startElem);
    var endP = this.endPos.call(this.endElem);
    var alpha = Math.atan2(endP.y - startP.y, endP.x - startP.x);
    var offsetX1 = 5 * Math.cos(alpha - Math.PI / 6);
    var offsetY1 = 5 * Math.sin(alpha - Math.PI / 6);
    var offsetX2 = 5 * Math.cos(alpha + Math.PI / 6);
    var offsetY2 = 5 * Math.sin(alpha + Math.PI / 6);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(startP.x, startP.y);
    ctx.lineTo(endP.x, endP.y);
    ctx.moveTo(endP.x, endP.y);
    ctx.lineTo(endP.x - offsetX1, endP.y - offsetY1);
    ctx.moveTo(endP.x, endP.y);
    ctx.lineTo(endP.x - offsetX2, endP.y - offsetY2);
    ctx.closePath();
    ctx.stroke();
};

BaseArrow.prototype.delete = function () {

};