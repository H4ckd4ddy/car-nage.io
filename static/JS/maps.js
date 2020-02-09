/* Fonction bordures de la map */

function generate_empty_map() {
    let map = [];
    map[0] = new Mur('vertical', largeurMur/2, 0, hCan);
    map[1] = new Mur('horizontal', 0, largeurMur/2, wCan);
    map[2] = new Mur('vertical', hCan-(largeurMur/2), 0, hCan);
    map[3] = new Mur('horizontal', 0, wCan-(largeurMur/2), wCan);
    return map;
}

/* Map de développement */

var devMap = generate_empty_map();

devMap[4] = new Mur('horizontal', prct(20,'x'), prct(20,'y'), prct(60,'x'));
devMap[5] = new Mur('vertical', prct(80,'x'), prct(20,'y'), prct(40,'y'));
devMap[6] = new Mur('vertical', prct(50,'x'), prct(40,'y'), prct(40,'y'));
devMap[7] = new Mur('horizontal', prct(20,'x'), prct(80,'y'), prct(30,'x'));



function generate_map_from_schema(schema){
    let new_map = generate_empty_map();
    let y_step = (hauteur/(schema.length-2));
    let x_step = (largeur/(schema[0].length-2));
    let y = 0;
    console.log(schema);
    for(let row = 1;row < schema.length-1;row++){
        let x = 0;
        for(let column = 1;column < schema[0].length-1;column++){
            if(schema[row][column] == '#'){
                if(schema[row][column+1] == '#'){
                    new_map.push(new Mur('horizontal', x+(x_step/2)-5, y+(y_step/2), (x_step/2)+10));
                }
                if(schema[row][column-1] == '#'){
                    new_map.push(new Mur('horizontal', x-5, y+(y_step/2), (x_step/2)+10));
                }

                if(schema[row+1][column] == '#'){
                    new_map.push(new Mur('vertical', x+(x_step/2), y+(y_step/2)-5, (y_step/2)+10));
                }
                if(schema[row-1][column] == '#'){
                    new_map.push(new Mur('vertical', x+(x_step/2), y-5, (y_step/2)+10));
                }

                //new_map.push(new Mur('horizontal', x, y+(y_step/2), x_step));
                //new_map.push(new Mur('vertical', x+(x_step/2), y, y_step));
            }
            x += x_step;
        }
        y += y_step;
    }
    return new_map;
}