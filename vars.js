var grid = [];
var upcoming = [];
var hold = -1;
var piece;

var heldyet = false;
var rowclear = {rows: [], progress: -1};
var inanimation = false;
var score = 0;
var level = 0;
var scores = [10, 20, 50, 80, -99999];
var lines = 0;

var gamestatus = 1; // 0-paused, 0.5-paused+controls, 1-midgame
var pSelect = 0;
var lSelect = 0;
var controls = 0;
var controlnames = ["move", "bezel\nmove", "bezel\nrotate"];

var frameN = 0;

var int;

var gearIcon = new Image();
gearIcon.src = 'image.png';
var bestris = new Image();
bestris.src = 'bestris.png';
var gameC = document.getElementById('game');
var uiC = document.getElementById('ui');



var ctx = gameC.getContext('2d'); // 24x24

var colors = ['cyan', 'blue', 'orange', 'yellow', 'lime', 'purple', 'red'];
var cs = {
	bg: '#555', // game background
	black: 'black', // blackboard color
	shadow: '#333', // shadow color
};
var gs = 30; // scale of 12x12 grid for easier UI
var buzz = true;
var highscore = -1;

highscore = localStorage.getItem('highscore');
if(highscore == undefined) {
	highscore = -1;
	localStorage.setItem("highscore", -1);
}
controls = localStorage.getItem('controls');
if(controls == undefined) {
	if(tizen && tizen.systeminfo.getCapability('http://tizen.org/feature/input.rotating_bezel')) {
		controls = 1;
	} else {
		controls = 0;
	}
	localStorage.setItem("controls", 0);
}
buzz = localStorage.getItem('buzz');
if(buzz == undefined) {
	buzz = true;
	localStorage.setItem("buzz", true);
}


