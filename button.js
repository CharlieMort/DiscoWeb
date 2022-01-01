class Button {
    constructor(x, y, w, h, txt, color, callback) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.txt = txt;
        this.color = color;
        this.callback = callback;
    }

    show() {
        fill(this.color[0], this.color[1], this.color[2])
        rect(this.x-this.w/2, this.y-this.h/2, this.w, this.h);
        fill(this.color[3], this.color[4], this.color[5])
        textSize(40)
        text(this.txt, this.x, this.y);
    }

    checkClicked() {
        if (
            mouseX >= this.x && 
            mouseX <= this.x+this.w && 
            mouseY >= this.y && 
            mouseY <= this.y+this.h
        ) {
            return true;
        }
        return false;
    }

    click() {
        return this.callback();
    }
}

class Tile extends Button {
    constructor(x, y, id, callback, animal) {
        super(x,y,80,80,id,[255,255,255,0,0,0],callback);
        this.revealed = false;
        this.animal = animal;
        this.id = id;
    }

    show() {
        if (this.revealed) {
            fill(this.color[0], this.color[1], this.color[2])
            rect(this.x, this.y, this.w, this.h);
            fill(this.color[3], this.color[4], this.color[5])
            textSize(40)
            if (this.animal) {
                text(this.animal.tileName, this.x+this.w/2, this.y+this.h/2);
            } else {
                text(this.id, this.x+this.w/2, this.y+this.h/2);
            }
        }
        else {
            fill(this.color[0], this.color[1], this.color[2])
            rect(this.x, this.y, this.w, this.h);
        }
    }

    click() {
        if (this.revealed) return false;
        this.revealed = true;
        return true;
    }
}