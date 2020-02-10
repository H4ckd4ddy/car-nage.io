/*
################################################
#                                              #
#   Fichier contenant les variables globales   #
#                                              #
################################################
*/

var socket;
var id_joueur_local;
var nombre_de_joueurs;

/* variables globales */
var hauteur = 800;
var largeur = 800;
var largeur_mur = 10;
var map = [];
var run;
var son = document.getElementById('son');
document.getElementById("background").style.height = hauteur+"px";
document.getElementById("background").style.width = largeur+"px";

emplacements_joueurs = [[50,50,135],[750,750,315],[750,50,225],[50,750,45]];

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
var canvas = document.getElementById("background");
var context = canvas.getContext("2d");
var hCan = parseFloat(canvas.getAttribute('height'));
var wCan = parseFloat(canvas.getAttribute('width'));

