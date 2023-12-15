
/*
 * drawing.js
 * Bestris
 * Davedude Games
 * Jan 2021
 */
var ui = new UCan(uiC, 360, 360, 1);

var bImg = ui.newImg('bestris.png', 360, 360);
bImg.moveTo(180, 180);

var holdBox = ui.newRect(60, 60);
holdBox.fillColor = 'black';
holdBox.moveTo(295, 120);

var holdPiece = ui.newElement(function (ctx) {
	if(hold != -1)
		drawPiece(ctx, hold, 0, 0, 13);
});
holdPiece.moveTo(295, 120);
holdPiece.z = 9;

var nextPieces = ui.newElement(function (ctx) {
	for (let i = 0; i < 3; i++) {
		drawPiece(ctx, upcoming[i], 0, i*40+(i!=0)*3, 8+(i==0)*2);
	}
});
nextPieces.moveTo(295, 178);
nextPieces.z = 9;


var nextBox = ui.newRect(45, 130);
nextBox.fillColor = 'black';
nextBox.moveTo(295, 220);



var pauseImg = ui.newImg('pause.png', 60, 60);
pauseImg.moveTo(68, 91);

var scoreTxt = ui.newText('0');
scoreTxt.moveTo(54, 167);
scoreTxt.font = 'pix';
scoreTxt.size = 70;
scoreTxt.color = 'white';
scoreTxt.baseLine = 'middle';

var sTxt = ui.newText('SCORE');
sTxt.moveTo(55, 148);
sTxt.font = 'pix';
sTxt.size = 25;
sTxt.color = 'white';

var levelTxt = ui.newText('1');
levelTxt.moveTo(55, 227);
levelTxt.font = 'pix';
levelTxt.size = 45;
levelTxt.color = 'white';
levelTxt.baseLine = 'middle';

var lTxt = ui.newText('LEVEL');
lTxt.moveTo(54, 214);
lTxt.font = 'pix';
lTxt.size = 18;
lTxt.color = 'white';

var holdTxt = ui.newText('HOLD');
holdTxt.moveTo(295, 75);
holdTxt.font = 'pix';
holdTxt.size = 22;
holdTxt.color = 'white';

ui.update(); // load the text
ui.ctx.fillStyle = '#555';
ui.ctx.fillRect(0, 0, 360, 360);

var leftClick = ui.newRect(115, 190);
leftClick.origin = 'corner';
leftClick.moveTo(0, 170);
leftClick.border = 'none';
leftClick.fillColor = 'none';

leftClick.onClick = function () {
	if(controls == 0 || controls == 2) {
		piece.move(-1);
	}
	if(controls == 1) {
		piece.rotate(-1);
	}
	draw();
}

var rightClick = ui.newRect(115, 190);
rightClick.origin = 'corner';
rightClick.moveTo(245, 170);
rightClick.border = 'none';
rightClick.fillColor = 'none';

rightClick.onClick = function () {
	if(controls == 0 || controls == 2) {
		piece.move(1);
	}
	if(controls == 1) {
		piece.rotate(1);
	}
	draw();
}

var bottomClick = ui.newRect(130, 100);
bottomClick.origin = 'corner';
bottomClick.moveTo(115, 260);
bottomClick.border = 'none';
bottomClick.fillColor = 'none';

bottomClick.onClick = function () {
	piece.drop();
	draw();
}

var gearClick = ui.newRect(105, 150);
gearClick.origin = 'corner';
gearClick.moveTo(0, 0);
gearClick.border = 'none';
gearClick.fillColor = 'none';

gearClick.onClick = function () {
	pause();
	draw();
}

var holdClick = ui.newRect(105, 170);
holdClick.origin = 'corner';
holdClick.moveTo(255, 0);
holdClick.border = 'none';
holdClick.fillColor = 'none';

holdClick.onClick = function () {
	if(!heldyet) {
		var oldhold = hold;
		hold = piece.type;
		newPiece(oldhold);
		heldyet = true;
	}
	draw();
}

var topClick = ui.newRect(150, 80);
topClick.origin = 'corner';
topClick.moveTo(105, 0);
topClick.border = 'none';
topClick.fillColor = 'none';

topClick.onClick = function () {
	if(controls == 0) {
		piece.rotate(1);
		piece.lock = 0;
	}	
	draw();
}

var gUI = ui.newGroup();
ui.addToGroup(gUI, holdBox, nextBox, pauseImg, scoreTxt, sTxt, leftClick, rightClick, topClick, bottomClick, gearClick, holdClick, nextPieces, holdPiece, levelTxt, lTxt, holdTxt);
gUI.hide();

var o1txt = ui.newText("Resume");
o1txt.moveTo(180, 95);
o1txt.size = 30;
o1txt.font = 'pix';
o1txt.color = 'white';

var o1img = ui.newImg('play.png', 90, 90);
o1img.moveTo(180, 50);

var o1box = ui.newRect(200, 110);
o1box.moveTo(180, 60);
o1box.border = 'none';
o1box.fillColor = 'none';

o1box.onClick = function () {
	ctx.filter = 'none';
	gUI.show();
	pUI.hide();
	gamestatus = 1;
	draw();
	int = setTimeout(step, 800);
}

var o2txt = ui.newText("Restart");
o2txt.moveTo(180, 328);
o2txt.size = 30;
o2txt.font = 'pix';
o2txt.color = 'white';

var o2img = ui.newImg('restart.png', 90, 90);
o2img.moveTo(180, 283);

var o2box = ui.newRect(200, 110);
o2box.moveTo(180, 290);
o2box.border = 'none';
o2box.fillColor = 'none';

o2box.onClick = function () {
	ctx.filter = 'none';
	gUI.show();
	pUI.hide();
	restart();
	draw();
	gamestatus = 1;
	if(buzz) navigator.vibrate(200);
	setTimeout(step, 800);
}

var o3txt = ui.newText("Level");
o3txt.moveTo(60, 210);
o3txt.size = 30;
o3txt.font = 'pix';
o3txt.color = 'white';

var o3img = ui.newImg('level.png', 90, 90);
o3img.moveTo(60, 165);

var o3box = ui.newRect(200, 110);
o3box.moveTo(70, 175);
o3box.border = 'none';
o3box.fillColor = 'none';

o3box.onClick = function () {
	gamestatus = 0.2;
	pUI.hide();
	lUI.show();
	lSelect = level;
	lltxt.text = level+1;
}

var o4txt = ui.newText("controls");
o4txt.moveTo(290, 210);
o4txt.size = 30;
o4txt.font = 'pix';
o4txt.color = 'white';

var o4img = ui.newImg('controls.png', 90, 90);
o4img.moveTo(290, 165);

var o4box = ui.newRect(200, 110);
o4box.moveTo(280, 175);
o4box.border = 'none';
o4box.fillColor = 'none';

o4box.onClick = function () {
	pUI.hide();
	cUI.show();
	cbigarc1.hide();
	cbigarc2.hide();
	cbigcircle.hide();
	cbigtxt.hide();
	gamestatus = 0.5;
	pSelect = controls;
	updateControls();
	setTimeout(drawPause, 0);
}
function updateControls() {
	cltxt.loadPreSave('save' + pSelect);
	crtxt.loadPreSave('save' + pSelect);
	cntxt.text = controlnames[pSelect];

	if(pSelect >= 1) {
		cbigarc1.show();
		cbigarc2.show();
		cbigcircle.show();
		cbigtxt.show();
		ctbox.hide();
		cttxt.hide();
	} else {
		cbigarc1.hide();
		cbigarc2.hide();
		cbigcircle.hide();
		cbigtxt.hide();
		ctbox.show();
		cttxt.show();
	}
	if(pSelect == 1) {
		cbigtxt.text = 'move';
	}
	if(pSelect == 2) {
		cbigtxt.text = 'rotate';
	}
}

var pUI = ui.newGroup();
ui.addToGroup(pUI, o1txt, o1img, o1box, o2txt, o2img, o2box, o3txt, o3img, o3box, o4txt, o4img, o4box);
pUI.hide();

var clbox = ui.newRect(105, 190);
clbox.fillColor = '#f00';
clbox.border = 'none';
clbox.opacity = 0.7;
clbox.origin = 'corner';
clbox.moveTo(0, 170);

var cltxt = ui.newText("move");
cltxt.newPreSave("save0", { text: 'move', size: 40 });
cltxt.newPreSave("save1", { text: 'rotate', size: 30 });
cltxt.newPreSave("save2", { text: 'move', size: 40 });
cltxt.color = 'white';
cltxt.font = 'pix';
cltxt.size = 40;
cltxt.moveTo(53, 190);

var cltxt2 = ui.newText("left");
cltxt2.color = 'white';
cltxt2.font = 'pix';
cltxt2.size = 20;
cltxt2.moveTo(53, 215);

var crbox = ui.newRect(105, 190);
crbox.fillColor = '#00f';
crbox.border = 'none';
crbox.opacity = 0.7;
crbox.origin = 'corner';
crbox.moveTo(255, 170);

var crtxt = ui.newText("move");
crtxt.newPreSave("save0", { text: 'move', size: 40 });
crtxt.newPreSave("save1", { text: 'rotate', size: 30 });
crtxt.newPreSave("save2", { text: 'move', size: 40 });
crtxt.color = 'white';
crtxt.font = 'pix';
crtxt.size = 40;
crtxt.moveTo(305, 190);

var crtxt2 = ui.newText("right");
crtxt2.color = 'white';
crtxt2.font = 'pix';
crtxt2.size = 20;
crtxt2.moveTo(305, 215);

var cbbox = ui.newRect(150, 100);
cbbox.fillColor = '#0f0';
cbbox.border = 'none';
cbbox.opacity = 0.7;
cbbox.origin = 'corner';
cbbox.moveTo(105, 260);

var cbtxt = ui.newText("drop");
cbtxt.color = 'white';
cbtxt.font = 'pix';
cbtxt.size = 40;
cbtxt.moveTo(180, 320);

var ctbox = ui.newRect(150, 80);
ctbox.fillColor = '#90c';
ctbox.border = 'none';
ctbox.opacity = 0.7;
ctbox.origin = 'corner';
ctbox.moveTo(105, 0);

var cttxt = ui.newText("rotate");
cttxt.color = 'white';
cttxt.font = 'pix';
cttxt.size = 40;
cttxt.moveTo(180, 40);

var chbox = ui.newRect(105, 170);
chbox.fillColor = '#f90';
chbox.border = 'none';
chbox.opacity = 0.7;
chbox.origin = 'corner';
chbox.moveTo(255, 0);

var chtxt = ui.newText("hold");
chtxt.color = 'white';
chtxt.font = 'pix';
chtxt.size = 40;
chtxt.moveTo(305, 130);

var lArrow = ui.newText('<');
lArrow.font = 'pix';
lArrow.size = 45;
lArrow.color = 'white';
lArrow.moveTo(122, 165);

var clcircle = ui.newArc(60, 360);
clcircle.opacity = 0.7;
clcircle.crop = [30, -50, 30, 100];
clcircle.fillColor = 'white';
clcircle.lineColor = 'none';
clcircle.moveTo(80, 178);

var clclick = ui.newArc(90, 360);
clclick.fillColor = 'none';
clclick.lineColor = 'none';
clclick.z = -1;
clclick.moveTo(50, 178);

clclick.onClick = function () {
	pSelect = Math.max(0, pSelect-1);

	updateControls();
	if(buzz) navigator.vibrate(20);
}

var rArrow = ui.newText('>');
rArrow.font = 'pix';
rArrow.size = 45;
rArrow.color = 'white';
rArrow.moveTo(238, 165);

var crcircle = ui.newArc(60, 360);
crcircle.opacity = 0.7;
crcircle.crop = [-60, -50, 30, 100];
crcircle.fillColor = 'white';
crcircle.lineColor = 'none';
crcircle.moveTo(280, 178);

var crclick = ui.newArc(90, 360);
crclick.fillColor = 'none';
crclick.lineColor = 'none';
crclick.z = -1;
crclick.moveTo(310, 178);

crclick.onClick = function () {
	pSelect = Math.min(2, pSelect+1);

	updateControls();
	if(buzz) navigator.vibrate(20);
}

var cntxt = ui.newText("touch");
cntxt.color = 'white';
cntxt.font = 'pix';
cntxt.size = 40;
cntxt.moveTo(180, 100);

var cscircle = ui.newArc(80, 360);
cscircle.opacity = 0.7;
cscircle.crop = [-70, -80, 140, 45];
cscircle.fillColor = 'white';
cscircle.lineColor = 'none';
cscircle.moveTo(180, 290);

cscircle.onClick = function () {
	gamestatus = 0;
	controls = pSelect;
	localStorage.setItem("controls", controls);
	if(buzz) navigator.vibrate(200);
	cUI.hide();
	pUI.show();
}

var cstxt = ui.newText("save");
cstxt.color = 'white';
cstxt.font = 'pix';
cstxt.size = 40;
cstxt.moveTo(180, 225);

var cbigcircle = ui.newArc(180, 360);
cbigcircle.fillColor = 'none';
cbigcircle.lineColor = '#70a';
cbigcircle.lineWidth = 20;
cbigcircle.z = 10;
cbigcircle.moveTo(180, 180);

var cbigtxt = ui.newText("move");
cbigtxt.font = 'pix';
cbigtxt.color = 'white';
cbigtxt.size = 40;
cbigtxt.moveTo(180, 32);

var cbigarc1 = ui.newArc(160, 20);
cbigarc1.startAngle = -10;
cbigarc1.lineColor = 'white';
cbigarc1.fillColor = 'none';
cbigarc1.arrowEnd = true;
cbigarc1.z = 20;
cbigarc1.moveTo(180, 180);

var cbigarc2 = ui.newArc(160, 20);
cbigarc2.startAngle = 10;
cbigarc2.lineColor = 'white';
cbigarc2.fillColor = 'none';
cbigarc2.arrowEnd = true;
cbigarc2.z = 20;
cbigarc2.counterClock = true;
cbigarc2.moveTo(180, 180);

var cUI = ui.newGroup();
ui.addToGroup(cUI, clbox, cltxt, cltxt2, crbox, crtxt, crtxt2, cbbox, cbtxt, ctbox, cttxt, chbox, chtxt, lArrow, rArrow, clcircle, crcircle, cscircle, cntxt, cstxt, clclick, crclick, cbigarc1, cbigarc2, cbigcircle, cbigtxt);
cUI.hide();

var lltxt = ui.newText("1");
lltxt.font = 'pix';
lltxt.size = 150;
lltxt.color = 'white';
lltxt.moveTo(180, 140);

var llltxt = ui.newText("level");
llltxt.font = 'pix';
llltxt.size = 30;
llltxt.color = 'white';
llltxt.moveTo(180, 110);

var ll13txt = ui.newText("/ 13");
ll13txt.font = 'pix';
ll13txt.size = 40;
ll13txt.color = 'white';
ll13txt.moveTo(290, 195);

var llutxt = ui.newText(">");
llutxt.font = 'pix';
llutxt.size = 110;
llutxt.color = 'white';
llutxt.rotate = -90;
llutxt.moveTo(180, 10);

var lldtxt = ui.newText("<");
lldtxt.font = 'pix';
lldtxt.size = 110;
lldtxt.color = 'white';
lldtxt.rotate = -90;
lldtxt.moveTo(180, 290);

var llbtxt = ui.newText("back");
llbtxt.font = 'pix';
llbtxt.size = 30;
llbtxt.color = 'white';
llbtxt.moveTo(65, 178);

var llb2txt = ui.newText("<");
llb2txt.font = 'pix';
llb2txt.size = 60;
llb2txt.color = 'white';
llb2txt.moveTo(20, 170);

var llbclick = ui.newRect(180, 120);
llbclick.fillColor = 'none';
llbclick.border = 'none';
llbclick.moveTo(90, 180);

llbclick.onClick = function () {
	level = lSelect;
	lines = level * 15;
	gamestatus = 0;
	if(buzz) navigator.vibrate(200);
	lUI.hide();
	pUI.show();
	levelTxt.text = level+1;
	ui.update();
}

var lluclick = ui.newRect(360, 120);
lluclick.fillColor = 'none';
lluclick.border = 'none';
lluclick.moveTo(180, 60);

lluclick.onClick = function () {
	lSelect = Math.min(12, lSelect+1);
	lltxt.text = lSelect+1;
	if(buzz) navigator.vibrate(20);
}

var lldclick = ui.newRect(360, 120);
lldclick.fillColor = 'none';
lldclick.border = 'none';
lldclick.moveTo(180, 300);

lldclick.onClick = function () {
	lSelect = Math.max(0, lSelect-1);
	lltxt.text = lSelect+1;
	if(buzz) navigator.vibrate(20);
}

var lUI = ui.newGroup();
ui.addToGroup(lUI, lltxt, llltxt, ll13txt, llutxt, lldtxt, llbtxt, llb2txt, llbclick, lldclick, lluclick);
lUI.hide();

var eovertxt = ui.newText("game over");
eovertxt.font = 'pix';
eovertxt.size = 60;
eovertxt.color = 'white';
eovertxt.moveTo(180, 60);

var estxt = ui.newText("0");
estxt.font = 'pix';
estxt.size = 90;
estxt.color = 'white';
estxt.moveTo(180, 150);

var es2txt = ui.newText("You scored");
es2txt.font = 'pix';
es2txt.size = 25;
es2txt.color = 'white';
es2txt.moveTo(180, 130);

var es4txt = ui.newText("0");
es4txt.font = 'pix';
es4txt.size = 75;
es4txt.color = 'white';
es4txt.moveTo(180, 235);

var es5txt = ui.newText("High Score");
es5txt.font = 'pix';
es5txt.size = 22;
es5txt.color = 'white';
es5txt.moveTo(180, 215);

var es3txt = ui.newText("Press to\ncontinue");
es3txt.font = 'pix';
es3txt.size = 35;
es3txt.color = 'white';
es3txt.moveTo(180, 300);

var esclick = ui.newRect(360, 360);
esclick.fillColor = 'none';
esclick.border = 'none';
esclick.moveTo(180, 180);
esclick.onClick = function () {
	gUI.show();
	eUI.hide();
	restart();
	gamestatus = 1;
	int = setTimeout(step, 800);
	if(buzz) navigator.vibrate(200);
}
var eUI = ui.newGroup();
ui.addToGroup(eUI, eovertxt, estxt, es2txt, es3txt, esclick, es4txt, es5txt);
eUI.hide();

function drawPiece (fctx, type, fx, fy, s) {
	let x = fx - s*2;
	let y = fy - s*2;
	//fctx.fillStyle = 'rgba(255,255,255,0.5)'; // draw boundries
	//fctx.fillRect(x, y, s*4, s*4);
	if(type == 0) {
		fctx.fillStyle = 'cyan';
		fctx.fillRect(x+s*1.5, y, s, s*4);
	}
	if(type == 1) {
		fctx.fillStyle = 'blue';
		fctx.fillRect(x+s*2, y+s/2, s, s*3);
		fctx.fillRect(x+s, y+s/2, s, s);
	}
	if(type == 2) {
		fctx.fillStyle = 'orange';
		fctx.fillRect(x+s*2, y+s/2, s, s*3);
		fctx.fillRect(x+s, y+s*2.5, s, s);
	}
	if(type == 3) {
		fctx.fillStyle = 'yellow';
		fctx.fillRect(x+s, y+s, s*2, s*2);
	}
	if(type == 4) {
		fctx.fillStyle = 'lime';
		fctx.fillRect(x+s*2, y+s/2, s, s*2);
		fctx.fillRect(x+s, y+s*1.5, s, s*2);
	}
	if(type == 5) {
		fctx.fillStyle = 'purple';
		fctx.fillRect(x+s*2, y+s/2, s, s*3);
		fctx.fillRect(x+s, y+s*1.5, s, s);
	}
	if(type == 6) {
		fctx.fillStyle = 'red';
		fctx.fillRect(x+s*2, y+s*1.5, s, s*2);
		fctx.fillRect(x+s, y+s/2, s, s*2);
	}
}
function draw(lockwhite=false) {

	ctx.fillStyle = cs.bg;
	ctx.fillRect(0, 0, 48, 48);

	ctx.fillStyle = cs.black; // blackboard
	ctx.fillRect(7, 2, 10, 20); // 10x20

	for (var i = 0; i < grid.length; i++) {
		for (var j = 1; j < grid[i].length; j++) {
			if(grid[i][j] != -1) {
				ctx.fillStyle = colors[grid[i][j]];
				ctx.fillRect(7+i, 1+j, 1, 1);
			}
		}
	}
	if(piece) {
		var oldy = piece.y;
		while(piece.testPush(0, 1, false)) {
			// drop piece to make shadow (nothing here)	
		}
		
		for(var i = 0; i < piece.matrices[piece.r].length; i++) {
			for(var j = 0; j < piece.matrices[piece.r][i].length; j++) {
				if(piece.matrices[piece.r][i][j]) {
					ctx.fillStyle = cs.shadow;
					ctx.fillRect(7+(piece.x+j), 1+(piece.y+i), 1, 1);
					
				}
			}
		}
		piece.y = oldy;
		
		
		for(var i = 0; i < piece.matrices[piece.r].length; i++) {
			for(var j = 0; j < piece.matrices[piece.r][i].length; j++) {
				if(piece.matrices[piece.r][i][j]) {
					ctx.fillStyle = piece.color;
					ctx.fillRect(7+(piece.x+j), 1+(piece.y+i), 1, 1);
					if(piece.lock != 0) {
						ctx.fillStyle = 'rgba(255, 255, 255, ' + (piece.lock/2) + ')';
						ctx.fillRect(7+(piece.x+j), 1+(piece.y+i), 1, 1);
					}
				}
			}
		}
		
	}
}
function drawPause () {

	
	
	
}