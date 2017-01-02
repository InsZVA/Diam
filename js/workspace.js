/**
 * Created by InsZVA on 2016/12/30.
 */
// workspace state
const WS_READY = 0;
const WS_SELECTED = 1;
const WS_DRAW = 2;
// brush board
const BB_X = 0;
const BB_Y = 0;
const BB_N_X = 4;
const BB_MARGIN = 2;
const BB_WIDTH = BB_N_X * BI_WIDTH + (BB_N_X + 1) * BB_MARGIN;

function Workspace(canvas) {
    this.brushes = []; // 刷子列表
    this.currentBrush = null; // 当前刷子
    this.currentElement = null; // 当前元素
    this.canvas = canvas; // Canvas
    this.context = canvas.getContext("2d"); // Context
    this.elements = []; // 元素列表
    this.state = WS_READY; // 状态

    canvas.onmouseup = this.onmouseup.bind(this);
    canvas.onkeyup = this.onkeyup.bind(this);
    //canvas.onmousedown = this.onmousedown.bind(this);
    //canvas.onmouseover = this.onmouseover.bind(this);
    canvas.timer = setInterval(this.render.bind(this), 100);
}

Workspace.prototype.renderBrushes = function() {
    var ctx = this.context;
    this.brushes.forEach(function(b) {
        b.renderIcon(ctx);
    });
};

Workspace.prototype.renderBrushBoard = function() {
    this.context.strokeStyle = "black";
    this.context.strokeRect(0, 0, BB_WIDTH, this.canvas.height);

    this.renderBrushes();
};

Workspace.prototype.render = function() {
    var ctx = this.context;
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderBrushBoard();

    this.elements.forEach(function(e) {
        e.render(ctx);
    });
};

Workspace.prototype.addBrush = function(brush) {
    var count = this.brushes.length;
    var x = count % BB_N_X;
    var y = parseInt(count / BB_N_X);
    var ix = BB_MARGIN * (x+1) + BI_WIDTH * x;
    var iy = BB_MARGIN * (y+1) + BI_HEIGHT * y;
    var b = new brush(ix, iy);
    this.brushes.push(b);
};

Workspace.prototype.selectElement = function(x, y) {
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].posInSelectArea(x, y)) {
            this.select(this.elements[i]);
            return true;
        }
    }
    return false;
};

Workspace.prototype.select = function (b) {
    // select a brush or a element
    if (b instanceof BaseBrush) {
        var currentBrush = this.currentBrush;
        if (currentBrush)
            currentBrush.unselect();
        this.currentBrush = b.select();
        this.state = WS_DRAW;
        return currentBrush;
    }

    if (b instanceof DiagramElement) {
        var currentElement = this.currentElement;
        if (currentElement)
            currentElement.unselect();
        this.currentElement = b.select();
        this.state = WS_SELECTED;
        return currentElement;
    }
};

Workspace.prototype.unselect = function () {
    if (this.currentBrush) {
        this.currentBrush.unselect();
    }

    if (this.currentElement) {
        this.currentElement.unselect();
    }

    this.state = WS_READY;
};

Workspace.prototype.remove = function (b) {
    if (b instanceof DiagramElement) {
        b.delete();
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i] == b) {
                this.elements.slice(i, 1);
                this.unselect();
                break;
            }
        }
    }
};

Workspace.prototype.draw = function (x, y) {
    if (this.currentBrush) {
        this.state = WS_DRAW;
        var newElement = new this.currentBrush.element(x, y);
        this.elements.push(newElement);
    }
};

Workspace.prototype.onmouseup = function(event) {
    var x = event.offsetX;
    var y = event.offsetY;

    if (x < BB_WIDTH) {
        var xIndex = parseInt(x / (BB_MARGIN + BI_WIDTH));
        var yIndex = parseInt(y / (BB_MARGIN + BI_HEIGHT));
        var i = yIndex * BB_N_X + xIndex;
        if (i >= this.brushes.length) {
            this.unselect();
            return;
        }
        this.select(this.brushes[i]);
        return;
    }

    if (!this.selectElement(x, y))
        switch (this.state) {
            case WS_READY:
                break;
            case WS_DRAW:
                this.draw(x, y);
                break;
            case WS_SELECTED:
        }
};

Workspace.prototype.onkeyup = function (e) {
    switch (e.keyCode) {
        case 46: // delete
            switch (this.state) {
                case WS_SELECTED:
                    this.remove(this.currentElement);
            }
    }
};