/*
####################################
#                                  #
#   File containing globals vars   #
#                                  #
####################################
*/

var socket;
var local_player_id;
var players_count;

var game_height = 800;
var game_width = 800;
var walls_width = 10;
var map = [];
var run;
var son = document.getElementById('son');
document.getElementById("background").style.height = game_height+"px";
document.getElementById("background").style.width = game_width+"px";

players_emplacements = [[50,50,135],[750,750,315],[750,50,225],[50,750,45]];

/* default control keys [arrows,zqsd] */
const default_up_key = [38,90];
const default_down_key = [40,83];
const default_left_key = [37,81];
const default_right_key = [39,68];
const default_fire_key = [32,65];


const default_move_speed = 10;
const default_rotation_speed = 10;
const default_fire_delay = 1;


const player_width = 40;
const player_length = player_width*1.618033;
const bullet_diameter = 5;

var players = [];
var bullets = [];

/* Array containing pressed keys */
var keys = [];

var canvas = document.getElementById("background");
var context = canvas.getContext("2d");
var hCan = parseFloat(canvas.getAttribute('height'));
var wCan = parseFloat(canvas.getAttribute('width'));

