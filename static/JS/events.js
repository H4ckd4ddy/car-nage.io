/*
#######################################
#                                     #
#   File containing events handlers   #
#                                     #
#######################################
*/


/* If key is pressed, push it in keys array */
document.addEventListener("keydown", function(event){
	if(keys.indexOf(event.keyCode) < 0){
		keys.push(event.keyCode);
	}
}, false);

/* If key is released, pop it from keys array */
document.addEventListener("keyup", function(event){
	if(keys.indexOf(event.keyCode) >= 0){
		keys.splice(keys.indexOf(event.keyCode), 1);
	}
}, false);


/* Initialisation des evenements socket à la fin de chargement du DOM */
document.addEventListener("DOMContentLoaded", function() {
    map = devMap;

    socket = io.connect(document.location.protocol+'//'+document.domain+':'+location.port);

    socket.on('game_info', function(data) {
        local_player_id = data.player_id;
        players_count = data.players_count;
    });
    socket.on('j', function(data) {
        if(players[data[0]].remote){
            players[data[0]].set_position(data[1],data[2],data[3]);
        }
    });
    socket.on('tir', function(data) {
        if(players[data.id].remote){
            bullets.push(new bullet(data.x,data.y,data.angle));
        }
    });
    socket.on('info', function(data) {
        waiting_screen(data.message);
    });
    socket.on('map', function(data) {
        map = generate_map_from_schema(generate_maze(data.map.width,data.map.height,data.map.seed));
    });
    socket.on('confirm', function(data) {
        waiting_screen(data.message, true);
    });
    socket.on('start', function(data) {
        new_game();
    });
    socket.on('disconnect', function(data) {
        waiting_screen("Un joueur s'est deconnecté, fin de partie");
        window.setTimeout(function(){
            document.location = '/';
        }, 2000);
    });

    waiting_screen("Merci de patienter...")

});