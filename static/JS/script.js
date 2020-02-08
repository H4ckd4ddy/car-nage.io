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
var touche_haut_standard = [38,90];
var touche_bas_standard = [40,83];
var touche_gauche_standard = [37,81];
var touche_droite_standard = [39,68];
var touche_tir_standard = [18,65];


var vitesse_deplacement_standard = 10;
var vitesse_rotation_standard = 10;
var delai_tir_standard = 1;


var largeur_joueur = 40;
var longueur_joueur = largeur_joueur*1.618033;
var diametreProjectile = 5;

var joueurs = [];
var projectiles = [];

/* Tableau stockant les touches en cours d'appui */
var touches = [];


//On prend le contexte 2d du canvas
var canvas = document.getElementById("background"),
    context = canvas.getContext("2d"),
    hCan = parseFloat(canvas.getAttribute('height')),
    wCan = parseFloat(canvas.getAttribute('width'));

//Fonction d'affichage des murs suivant la map
function affichageMurs(array) {
    context.clearRect(0,0,wCan,hCan);
    context.fillStyle = 'black';
    for(var i = 0; i < array.length; i++){
        context.fillRect(array[i].rectX, array[i].rectY, array[i].w, array[i].h);
    }
}

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
    run = new interval(25, maj)
    run.run()
}

document.addEventListener("DOMContentLoaded", function() {
    map = devMap;

    socket = io.connect('http://' + document.domain + ':' + location.port + '/game');
    socket.on('connect', function() {
        socket.emit('joined', {});
    });
    socket.on('j', function(data) {
        if(joueurs[data.id].distant){
            joueurs[data.id].teleportation(data.x,data.y,data.angle);
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
        alert(data.message);
        socket.emit('ready', {});
    });
    socket.on('start', function(data) {
        new_game();
    });

    waiting_screen("Merci de patienter...")

});