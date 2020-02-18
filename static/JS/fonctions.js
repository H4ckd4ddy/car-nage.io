/*
#########################################
#                                       #
#   File containing globals functions   #
#                                       #
#########################################
*/


function new_game() {
    bullets = [];
    keys = [];
    generate_players();
    run = new interval(30, update)
    run.run()
}

function generate_players() {
    players = [];
    for(let i = 0;i < players_count;i++){
        players.push(new player(i,players_emplacements[i][0],players_emplacements[i][1],players_emplacements[i][2]))
    }
}

//Check pressed keys (in "keys" array)
function move(){

    local_player = players[local_player_id];
    
    if(keys.indexOf(local_player.key_left) >= 0){
    	local_player.rotate_left();
    }
    
    if(keys.indexOf(local_player.key_right) >= 0){
    	local_player.rotate_right();
    }
    
    if(keys.indexOf(local_player.key_up) >= 0){
    	local_player.forward();
    }
    
    if(keys.indexOf(local_player.key_down) >= 0){
    	local_player.backward();
    }
    
    if(keys.indexOf(local_player.key_fire) >= 0){
    	local_player.fire();
    }
	
}

function display_walls(array) {
    context.clearRect(0,0,wCan,hCan);
    context.fillStyle = 'black';
    for(var i = 0; i < array.length; i++){
        context.fillRect(array[i].rectX, array[i].rectY, array[i].w, array[i].h);
    }
}

function display_players(){
	
	for(var i = 0;i < players.length;i++) {
		
		if(players[i].status !== 'mort') {
            var img = new Image();
            img.src = '/img/voiture' + (i + 1) + '.png';
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.translate(players[i].x, players[i].y);
            context.rotate(players[i].angle * Math.PI / 180);
            context.drawImage(img, -25, -50, 50, 100);
            context.restore();
        }
        
	}
	
}

function bullets_move(){

    for(var i = 0;i < bullets.length;i++){
        if(bullets[i] !== 'explosé') {
            bullets[i].way();
        }
    }

}

function display_bullets(){
    for(var i = 0; i < bullets.length; i++) {
		
        var bullet_image = new Image();
        bullet_image.src = '/img/ball.png';
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(bullets[i].x,bullets[i].y);
        context.drawImage(bullet_image,-15,-15, 15, 15);
        context.restore();
    }
}

function update(){
    context.clearRect(0,0,wCan,hCan);
    display_walls(map);
    display_players();
	move();
	bullets_move();
	display_bullets();
}

function explosion(x,y) {
    var boom;
    boom = setInterval(function () {
        var img = new Image();
        img.src = '/img/explosion.png';
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(x,y);
        context.drawImage(img,-100,-100, 200, 200);
        context.restore();
    },10);
    var temp = 2;
    if(temp === 1) {
        son.setAttribute('src', '/son/explosion.wav');
    }else if(temp === 2){
        son.setAttribute('src', '/son/explosion1.wav');
    }else{
        son.setAttribute('src', '/son/explosion2.wav');
    }
    son.play();
    setTimeout(function(){clearInterval(boom)}, 400);
}


// More acurate interval function based on timestamp
function interval(duration, fn){
    
    this.baseline = undefined
    
    this.run = function(){
        if(this.baseline === undefined){
            this.baseline = new Date().getTime()
        }
        fn()
        var end = new Date().getTime()
        this.baseline += duration
        
        var nextTick = duration - (end - this.baseline)
        if(nextTick<0){
            nextTick = 0
        }
        (function(i){
            i.timer = setTimeout(function(){
                i.run(end)
            }, nextTick)
        }(this))
    }

    this.stop = function(){
        clearTimeout(this.timer)
    }
}