var MPImage = function(anImage) {
    this.img = anImage;
    this.pg = createGraphics(this.img.width, this.img.height);
    this.mps = [];

    this.updateMetaPixels = function() {
        this.mps = [];

        this.img.loadPixels();
        // var num = this.img.pixels.length;
        // for (var i=0; i<num; i=i+4) {
        //     var r = this.img.pixels[i];
        //     var g = this.img.pixels[i+1];
        //     var b = this.img.pixels[i+2];
        //     var a = this.img.pixels[i+3];
        //
        //     var ii  = i/4;
        //     var x = ii%this.img.width;
        //     var y = ii/this.img.width;
        //     var mp = new MetaPixel(x, y, r, g, b, a);
        //     mp.setMax(this.img.width, this.img.height);
        //     this.mps.push(mp);
        // }

        for (var i=0; i<this.img.width; i++) {
            for (var j=0; j<this.img.height; j++) {
                var off = (j*this.img.width+i)*4;
                var r = this.img.pixels[off];
                var g = this.img.pixels[off+1];
                var b = this.img.pixels[off+2];
                var a = this.img.pixels[off+3];
                var mp = new MetaPixel(i, j, r, g, b, a);
                mp.setMax(this.img.width, this.img.height);
                this.mps.push(mp);
            }
        }
    }


    this.processMPImage = function() {
        this.pg.noStroke();
        this.pg.background(255);

        // for (var i=0; i<this.mps.length; i++) {
        //     this.mps[i].displayOn(this.pg);
        // }
        for (var i=this.mps.length-1; i>=0; i--) {
            this.mps[i].displayOn(this.pg);
        }

    }

    this.do01 = function() {
        for (var i=0; i<this.mps.length; i++) {
            var p = this.mps[i];
            if (p.r > p.g) {
                p.moveLeft(p.r*0.05);
            } else {
                p.moveDown(1);
            }
        }
    }

    this.do02 = function() {
        for (var i=0; i<this.mps.length; i++) {
            var p = this.mps[i];
            if (p.r > p.g) {
                p.beStrong(15);
                p.moveDown(p.r*0.3);
            } else {
                p.moveRandom(p.r*0.5);
            }
        }
    }
}
