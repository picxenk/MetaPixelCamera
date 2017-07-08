var MetaPixel = function(px, py, pr, pg, pb, pa) {
    this.x = px;
    this.y = py;
    this.maxW;
    this.maxH;
    this.w = 1;

    this.r = pr;
    this.g = pg;
    this.b = pb;
    this.a = pa;
    this.c = color(pr, pg, pb, pa);

    this.displayOn = function(pg) {
        if (this.w == 1) {
            pg.stroke(this.c);
            pg.point(this.x, this.y);
        } else {
            pg.stroke(this.c);
            pg.fill(this.c);
            pg.rect(this.x, this.y, this.w, this.w);
        }
    }

    this.setMax = function(mw, mh) {
        this.maxW = mw;
        this.maxH = mh;
    }

    this.moveH = function(n) {
        this.x = this.x + n;
        if (this.x < 0) {
            this.x = this.maxW + this.x;
        }
        if (this.maxW < this.x) {
            this.x = this.maxW - this.x;
        }
    }

    this.moveV = function(n) {
        this.y = this.y + n;
        if (this.y < 0) {
            this.y = this.maxH + this.y;
        }
        if (this.maxH < this.y) {
            this.y = this.maxH - this.y;
        }
    }

    this.moveLeft = function(n) {
        this.moveH(n*-1);
    }
    this.moveRight = function(n) {
        this.moveH(n);
    }
    this.moveUp = function(n) {
        this.moveV(n*-1);
    }
    this.moveDown = function(n) {
        this.moveV(n);
    }

    this.moveRandom = function(n) {
        this.x = this.x + random(n*-1, n);
        this.y = this.y + random(n*-1, n);
    }
    this.beStrong = function(n) {
        this.w = this.w + n;
    }
}
