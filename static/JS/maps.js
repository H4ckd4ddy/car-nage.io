/* Fonction bordures de la map */

function generate_empty_map() {
    let map = [];
    map[0] = new Mur('vertical', largeur_mur/2, 0, hCan);
    map[1] = new Mur('horizontal', 0, largeur_mur/2, wCan);
    map[2] = new Mur('vertical', hCan-(largeur_mur/2), 0, hCan);
    map[3] = new Mur('horizontal', 0, wCan-(largeur_mur/2), wCan);
    return map;
}

/* Map de développement */

var devMap = generate_empty_map();

devMap[4] = new Mur('horizontal', prct(20,'x'), prct(20,'y'), prct(60,'x'));
devMap[5] = new Mur('vertical', prct(80,'x'), prct(20,'y'), prct(40,'y'));
devMap[6] = new Mur('vertical', prct(50,'x'), prct(40,'y'), prct(40,'y'));
devMap[7] = new Mur('horizontal', prct(20,'x'), prct(80,'y'), prct(30,'x'));


function generate_map_from_schema(schema){
    let new_map = [];
    let y_step = ((hauteur-largeur_mur)/(schema.length-1));
    let x_step = ((largeur-largeur_mur)/(schema[0].length-1));
    let x,y,size,block_count = 0;
    console.log(schema);
    console.log(x_step);
    //generate horizontal wall
    for(let row = 0;row < schema.length;row++){
        y = (row*y_step)+(largeur_mur/2);
        for(let column = 0;column < schema[0].length-1;column++){
            if(schema[row][column] == '#'){
                x = (column*x_step);
                size = largeur_mur;
                block_count = 1;
                while(schema[row][column+block_count] == '#'){
                    block_count++;
                    size += x_step;
                }
                if(block_count > 1){
                    new_map.push(new Mur('horizontal', x, y, size));
                }
                column += block_count;
            }
        }
    }
    //generate vertical wall
    for(let column = 0;column < schema[0].length;column++){
        x = (column*x_step)+(largeur_mur/2);
        for(let row = 0;row < schema.length-1;row++){
            if(schema[row][column] == '#'){
                y = (row*y_step);
                size = largeur_mur;
                block_count = 1;
                while((schema[row+block_count])&&(schema[row+block_count][column] == '#')){
                    block_count++;
                    size += y_step;
                }
                if(block_count > 1){
                    new_map.push(new Mur('vertical', x, y, size));
                }
                row += block_count;
            }
        }
    }
    console.log(new_map);
    return new_map;
}

//Pourcentage des longueurs en fonction de l'axe
function prct(x,axe){
    if(axe === 'x'){return wCan/100 * x;}
    else if(axe === 'y'){return hCan/100 * x;}
}