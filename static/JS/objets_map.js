/* Variables */
var Murs = [];

/* Constructeur */

var Mur = function(orientation, x, y, l) {
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.orientation = orientation;
    if (orientation === 'vertical'){
        this.w = walls_width;
        this.h = Math.round(l);
        this.rectX = x - (walls_width/2);
        this.rectY = y;
    } else if (orientation === 'horizontal') {
        this.w = Math.round(l);
        this.h = walls_width;
        this.rectX = x;
        this.rectY = y - (walls_width/2);
    }
    this.faces = [];
    for(var i = 0; i < 4; i++){
        if(this.orientation === 'vertical') {
            var face;
            if(i === 0){ face = new Face(this.rectX, this.rectY, this.rectX+walls_width, this.rectY, 'horizontal')}
            else if(i === 1){ face = new Face(this.rectX+walls_width, this.rectY, this.rectX+walls_width, this.rectY+l, 'vertical')}
            else if(i === 2){ face = new Face(this.rectX, this.rectY+l, this.rectX+walls_width, this.rectY+l, 'horizontal')}
            else if(i === 3){ face = new Face(this.rectX, this.rectY, this.rectX, this.rectY+l, 'vertical')}
        } else if (this.orientation === 'horizontal'){
            if(i === 0){ face = new Face(this.rectX, this.rectY, this.rectX+l, this.rectY, 'horizontal')}
            else if(i === 1){ face = new Face(this.rectX+l, this.rectY, this.rectX+l, this.rectY+walls_width, 'vertical')}
            else if(i === 2){ face = new Face(this.rectX, this.rectY+walls_width, this.rectX+l, this.rectY+walls_width, 'horizontal')}
            else if(i === 3){ face = new Face(this.rectX, this.rectY, this.rectX, this.rectY+walls_width, 'vertical')}
        }
        this.faces.push(face);
    }
    //Murs.push(this);
};

var Face = function (x1, y1, x2, y2, orientation) {
    this.debut = {x:x1,y:y1};
    this.fin = {x:x2,y:y2};
    this.orientation = orientation;
};