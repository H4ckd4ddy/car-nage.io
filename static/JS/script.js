var socket;

/* variables globales */
var hauteur = 800;
var largeur = 800;
var map = [];
var run;
var son = document.getElementById('son');
document.getElementById("background").style.height = hauteur+"px";
document.getElementById("background").style.width = largeur+"px";

emplacements_joueurs = [[50,70,180],[750,730,0],[750,70,180],[50,730,0]];

/* liste des codes des touche de jeu par defaut [fleches,zqsd] */
const touche_haut_standard = [38,90];
const touche_bas_standard = [40,83];
const touche_gauche_standard = [37,81];
const touche_droite_standard = [39,68];
const touche_tir_standard = [18,65];


const vitesse_deplacement_standard = 10;
const vitesse_rotation_standard = 10;
const delai_tir_standard = 1;


const largeur_joueur = 40;
const longueur_joueur = largeur_joueur*1.618033;
const diametreProjectile = 5;

var joueurs = [];
var projectiles = [];

/* Tableau stockant les touches en cours d'appui */
var touches = [];


//On prend le contexte 2d du canvas
var canvas = document.getElementById("background"),
    context = canvas.getContext("2d"),
    hCan = parseFloat(canvas.getAttribute('height')),
    wCan = parseFloat(canvas.getAttribute('width'));

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

/* Initialisation, a la fin du chargement du DOM */

function new_game() {
    projectiles = [];
    touches = [];
    generation_joueurs();
    run = new interval(30, maj)
    run.run()
}

document.addEventListener("DOMContentLoaded", function() {
    map = devMap;

    socket = io.connect(document.location.protocol+'//'+document.domain+':'+location.port+'/game');
    socket.on('connect', function() {
        socket.emit('joined', {});
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
    socket.on('map', function(data) {
        map = generate_map_from_schema(data.map);
    });
    socket.on('confirm', function(data) {
        alert(data.message);
        socket.emit('ready', {});
    });
    socket.on('start', function(data) {
        new_game();
    });

    waiting_screen("Merci de patienter...")

});