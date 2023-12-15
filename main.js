/*
 * main.js
 * Bestris
 * Davedude Games
 * Jan 2021
 */


document.addEventListener('tizenhwkey', function( ev ) {
	if( tizen && ev.keyName == "back" ) {
		tizen.application.getCurrentApplication().exit();
	}
});
var tizen;
if(tizen && tizen.systeminfo.getCapability('http://tizen.org/feature/input.rotating_bezel')) {
	document.addEventListener('rotarydetent', function(ev) {
	    var direction = ev.detail.direction;
	    if (direction == 'CW') {
	        bezel(1);
	    } else if (direction == 'CCW') {
	        bezel(-1);
	    }
	});
}
//document.addEventListener('mousedown', function () { tizen.feedback.stop(); console.log('gg'); return false; });
var turnsz = 0;
var prevt = -1;
function bezel(dir) {
	
	//console.log(dir);
	if(inanimation) return false; // if in animation, STOP
	if(gamestatus == 1) {
		if(controls == 1) {
			piece.move(dir);
		}
		if(controls == 2) {
			piece.rotate(dir);
		}
		draw();
	}
}

function newBag () {
	var nBag = [];
	for(let i = 0; i <= 6; i++) { // add the 6 pieces to the bag
		nBag.splice(Math.floor(Math.random()*(nBag.length+1)), 0, i);
	}
	upcoming = upcoming.concat(nBag);
	//console.log(nBag);
}
function restart () {
	grid = [];
	for(let x = 0; x < 10; x++) { // Create the 10x21 grid
		grid[x] = [];
		for(let y = 0; y < 21; y++) {
			grid[x][y] = -1;
		}
	}
	ctx.filter = 'none';
	upcoming = [];
	newBag();
	newBag();
	newPiece();
	score = 0;
	level = 0;
	scoreTxt.text = score;
	levelTxt.text = level+1;
	ui.update();
	lines = 0;
	hold = -1;
	draw();
	
}
function runClearRows () {
	for (var i = 0; i < rowclear.rows.length; i++) {
		var n = rowclear.progress - i;
		if(n >= 0 && n < 10) {
			//console.log(rowclear.rows[i], 9-n);
			for (var y = rowclear.rows[i]; y > 0; y--) {
				grid[9-n][y] = grid[9-n][y-1];
			}
			
		}
	}
	rowclear.progress++;
	draw();
	//console.log(rowclear.progress, 10+rowclear.rows.length);
	if(rowclear.progress < 9 + rowclear.rows.length) {
		setTimeout(runClearRows, 50);
	} else {
		inanimation = false;
		score += scores[rowclear.rows.length-1] * (level+1);
		lines += rowclear.rows.length;
		level = Math.floor(lines/15);
		scoreTxt.text = score;
		scoreTxt.size = Math.max(30, 70 - Math.max(1, Math.floor(Math.log10(score)))*8);

		levelTxt.text = level+1;

		ui.update();
		newPiece();
	}
}
function clearRows () {
	rowclear.rows = [];
	rowclear.progress = 0;
	for (var y = 1; y < 21; y++) {
		let sum = 0;
		for (var x = 0; x < 10; x++) {
			sum += (grid[x][y] != -1);
		}
		if(sum == 10) {
			rowclear.rows.push(y);
		}
	}	
	if(rowclear.rows.length > 0) {
		if(buzz) navigator.vibrate(500 + (rowclear.rows.length-1) * 50);
		inanimation = true;
		setTimeout(runClearRows, 50);
	} else {
		newPiece();
	}
}
function endGame () {
	
	ctx.filter = 'blur(0.8px) brightness(50%)';
	gUI.hide();
	draw();
	eUI.show();
	estxt.text = score;
	es4txt.text = highscore;
	es5txt.text = 'highscore';
	if(highscore < score) {
		highscore = score;
		localStorage.setItem("highscore", highscore);
		es4txt.text = '';
		es5txt.text = 'New high score!';
	}
	
	ui.update();
	clearTimeout(int);
}
function pause () {
	
	ctx.filter = 'blur(0.8px) brightness(50%)';
	gUI.hide();
	pUI.show();
	draw();
	gamestatus = 0;
	pSelect = 0;
	clearTimeout(int);
}



function newPiece (type2=-1) {
	type = type2;
	if(type == -1) {
		type = upcoming.splice(0,1)[0];
		if(upcoming.length < 4) newBag();
	}
	heldyet = false;
	piece = new Piece(type);
	if(!piece.testPush(0, 0, false)) {
		draw();
		gamestatus = 2;
		setTimeout(endGame, 1000);
	}
	ui.update();
}
var oldtime = 0;
var stepp = 0;
function step () {
	if(gamestatus == 1) {
		var newtime = (new Date()).getTime();
		oldtime = newtime;
		stepp = (piece.isDropping ? 10*(level>=12?1/8:(13-level)/8) : 400*(level>=12?1/8:(13-level)/8));
		int = setTimeout(step, (piece.isDropping ? 10*(level>=12?1/8:(13-level)/8) : 400*(level>=12?1/8:(13-level)/8)));
		if(!inanimation)
			piece.gravity();
		draw();
		
		
	}
}

setTimeout(function () {
	restart();
	newBag();
	newPiece();

	gUI.show();
	bImg.hide();
	ui.update();
	draw();
	
	int = setTimeout(step, 800);
}, 1000);




