/*
#########################################################
#                                                       #
# Fichier contenant les fonctions de generation de map  #
#                                                       #
#########################################################
*/


function generate_grid(width, height){
    var grid = [];
    if((width % 2) == 0){
        width--;
    }
    if((height % 2) == 0){
        height--;
    }

    var full_row = [];
    var empty_row = [];

    for(let column = 0;column < width;column++){
        full_row.push('#');
        if((column % 2) == 0){
            empty_row.push('#');
        }else{
            empty_row.push('-');
        }
    }

    for(let row = 0;row < height;row++){
        if((row % 2) == 0){
            grid.push([...full_row]);
        }else{
            grid.push([...empty_row]);
        }
    }

    return grid;
}

function search_in_grid(grid, search){
    for(let [row_number, row] of Object.entries(grid)){
        for(let [column_number, value] of Object.entries(row)){
            if(value == search){
                return [row_number, column_number];
            }
        }
    }
    return null;
}

function median(values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2){
        return values[half];
    }else{
        return (values[half-1] + values[half]) / 2.0;
    }
}

// Park-Miller PRNG
function PRNG(seed){
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}
PRNG.prototype.int = function (){
  return this._seed = this._seed * 16807 % 2147483647;
};
PRNG.prototype.float = function(){
  return (this.int() - 1) / 2147483646;
};
PRNG.prototype.between = function(min,max){
  return Math.round(this.float() * ((max-1) - min) + min);
};
PRNG.prototype.choice = function(array){
  return array[this.between(0,array.length)];
};

function generate_maze(width, height, seed=null){
    if((width % 2) == 0){
        width--;
    }
    if((height % 2) == 0){
        height--;
    }

    var grid = generate_grid(width, height);

    if(seed){
        var random = new PRNG(seed);
    }

    var history = [];

    var position = [1,1];

    while(search_in_grid(grid, '-')){

        grid[position[0]][position[1]] = ' ';

        var possibilities = [];
        var walls = [];

        if((grid[position[0]-2])&&(grid[position[0]-2][position[1]] == '-')){
            possibilities.push([position[0]-2,position[1]]);
        }

        if((grid[position[0]][position[1]+2])&&(grid[position[0]][position[1]+2] == '-')){
            possibilities.push([position[0],position[1]+2]);
        }

        if((grid[position[0]+2])&&(grid[position[0]+2][position[1]] == '-')){
            possibilities.push([position[0]+2,position[1]]);
        }

        if((grid[position[0]][position[1]-2])&&(grid[position[0]][position[1]-2] == '-')){
            possibilities.push([position[0],position[1]-2]);
        }

        if(possibilities.length > 0){
            history.push(position);
            if(seed){
                var next_position = random.choice(possibilities);
            }else{
                var next_position = possibilities[Math.floor(Math.random()*possibilities.length)];
            }
            var wall_row = Math.round(median([position[0],next_position[0]]));
            var wall_column = Math.round(median([position[1],next_position[1]]));
            grid[wall_row][wall_column] = ' ';
            position = next_position;
        }else{
            position = history.pop()
        }

    }
    return grid;
}