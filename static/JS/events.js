/* A l'appui d'une touche, on l'ajoute dans le tableau */
document.addEventListener("keydown", function(event){
	if(touches.indexOf(event.keyCode) < 0){
		touches.push(event.keyCode);
	}
}, false);

/* Au relachement de la touche, on la retire du tableau */
document.addEventListener("keyup", function(event){
	if(touches.indexOf(event.keyCode) >= 0){
		touches.splice(touches.indexOf(event.keyCode), 1);
	}
}, false);


/* Initialisation des evenements socket à la fin de chargement du DOM */
document.addEventListener("DOMContentLoaded", function() {
    map = devMap;

    socket = io.connect(document.location.protocol+'//'+document.domain+':'+location.port);

    socket.on('game_info', function(data) {
        id_joueur_local = data.player_id;
        nombre_de_joueurs = data.players_count;
        map = generate_map_from_schema(generate_maze(data.map.width, data.map.height, data.map.seed));
    });
    socket.on('j', function(data) {
        if(joueurs[data[0]].distant){
            joueurs[data[0]].teleportation(data[1],data[2],data[3]);
        }
    });
    socket.on('tir', function(data) {
        if(joueurs[data.id].distant){
            projectiles.push(new projectile(data.x,data.y,data.angle));
        }
    });
    socket.on('info', function(data) {
        waiting_screen(data.message);
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