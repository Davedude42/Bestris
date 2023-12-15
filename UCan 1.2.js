// Canvas UI helper -- UCan
var dpi = window.devicePixelRatio;
function makeCANVASGOOD(canvas, width, height, scale) {
	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';

	canvas.setAttribute('width', width * dpi);
	canvas.setAttribute('height', height * dpi);

	var ctx = canvas.getContext('2d');
	ctx.scale(dpi * scale, dpi * scale);
	return ctx;
}

class UCan {
	constructor (canvas, width, height, scale) {
		this.canvas = canvas;
		this.ctx = makeCANVASGOOD(this.canvas, width, height, scale);

		this.scale = scale;
		this.width = this.canvas.width / this.scale;
		this.height = this.canvas.height / this.scale;
		

		this.bgColor = 'none';

		this.elements = [];
		this.idon = 0;

		this.mouseX = -1;
		this.mouseY = -1;

		this.canvas.addEventListener('mousemove', (e) => { this.mouseMove(e); this.mouseClick(); });
		//this.canvas.addEventListener('mousedown', () => { return false; this.mouseClick(); return false; });
	}
	update () {
		if(this.bgColor == 'none')
			this.ctx.clearRect(0, 0, this.width, this.height);
		else {
			this.ctx.fillStyle = this.bgColor;
			this.ctx.fillRect(0, 0, this.width, this.height);
		}
		this.elements.sort((a, b) => Math.sign(a.z - b.z) || Math.sign(a.id - b.id)); // sort by z, then when they were created
		for (let i = 0; i < this.elements.length; i++) {
			if(this.elements[i].shown)
				this.elements[i].draw(this.ctx);
		}
	}

	checkMove(els) {
		var elements = els;
		elements.sort((a, b) => Math.sign(a.z - b.z) || Math.sign(a.id - b.id));
		for (let i = 0; i < elements.length; i++) {
			let el = elements[i];
			el.changedInMouseEvent = false;
		}
		for (let i = 0; i < elements.length; i++) {
			let el = elements[i];
			if(el.mouseEvents == true) {	
				if(el.inMouseBox(this.mouseX, this.mouseY) && el.changedInMouseEvent == false) {
					if(el.mouseIn == false) {
						el.mouseIn = true;
						el._onMouseEnter();
					}
				} else if(el.mouseIn == true && el.changedInMouseEvent == false) {
					el.mouseIn = false;
					el._onMouseLeave();
				}
				if(el.type == 'Group' && el.changedInMouseEvent == false) {
					this.checkMove(el.members);
				}
			}
		}
	}

	checkClick(els) {
		var elements = els;
		elements.sort((a, b) => Math.sign(a.z - b.z) || Math.sign(a.id - b.id));
		for (let i = 0; i < elements.length; i++) {
			let el = elements[i];
			el.changedInMouseEvent = false;
		}
		for (let i = 0; i < elements.length; i++) {
			let el = elements[i];
			if(el.mouseEvents == true) {
				
				if(el.inMouseBox(this.mouseX, this.mouseY) && el.changedInMouseEvent == false) {
					el._onClick();
				}
				if(el.type == 'Group' && el.changedInMouseEvent == false) {
					this.checkClick(el.members);
				}
			}
		}
	}

	mouseMove(event) {
		this.mouseX = Math.max(0, Math.min(this.width-1, event.offsetX / this.scale));
		this.mouseY = Math.max(0, Math.min(this.height-1, event.offsetY / this.scale));

		this.checkMove(this.elements);
		this.update();
	}
	mouseClick() {
		this.checkClick(this.elements);
		this.update();
	}

	newElement(drawI) {
		this.elements[this.elements.length] = new Element(this.idon++, drawI);
		return this.elements[this.elements.length-1];
	}
	newRect(width=10, height=10) {
		this.elements[this.elements.length] = new Rect(this.idon++, width, height);
		return this.elements[this.elements.length-1];
	}
	newGroup() {
		this.elements[this.elements.length] = new Group(this.idon++);
		return this.elements[this.elements.length-1];
	}
	newText(text) {
		this.elements[this.elements.length] = new Text(this.idon++, text);
		return this.elements[this.elements.length-1];
	}
	newArrow() {
		this.elements[this.elements.length] = new Arrow(this.idon++);
		return this.elements[this.elements.length-1];
	}
	newArc(radius, angle) {
		this.elements[this.elements.length] = new Arc(this.idon++, radius, angle);
		return this.elements[this.elements.length-1];
	}
	newImg(src, width, height) {
		this.elements[this.elements.length] = new Img(this.idon++, src, width, height, () => { this.update(); });
		return this.elements[this.elements.length-1];
	}
	newMouseEvent(width, height) {
		this.elements[this.elements.length] = new MouseEvent(this.idon++, width, height);
		return this.elements[this.elements.length-1];
	}
	addToGroup() { // group, item1, item2, ...
		var group = arguments[0];
		
		for (let i = 1; i < arguments.length; i++) {
			let id = arguments[i].id;

			arguments[i].px = group.x;
			arguments[i].py = group.y;
			group.members.push(arguments[i]); // add to group
			this.elements = this.elements.filter(element => element.id != id); // remove from elements

		}
	}
	removeFromGroup() { // group, item1, item2, ...
		var group = arguments[0];
		for (let i = 1; i < arguments.length; i++) {
			let id = arguments[i].id;

			if(group.members.filter(element => element.id == id).length != 0) { // make sure the group includes the element
				arguments[i].px = 0;
				arguments[i].py = 0;
				this.elements.push(arguments[i]); // add to elements
				group.members = group.members.filter(element => element.id != id); // remove from group
			}
		}
	}
}

class Element {
	constructor (id, drawI) {
		this.drawI = drawI;
		this._x = 0;
		this._y = 0;
		this.shown = true;
		this.z = 0;
		this.id = id;

		this.rotate = 0;
		this.opacity = 1;
		this.crop = []; // x, y, width, height

		this.type = 'Element';

		this.hover = {};
		this.beforeHover = {};
		
		this.onClick = () => {}
		this.onMouseEnter = () => {}
		this.onMouseLeave = () => {}

		this.mouseEvents = true;
		this.mouseIn = false;

		this.px = 0;
		this.py = 0;

		this.preSaves = {};

		this.changedInMouseEvent = false;
	}
	moveTo(x, y) {
		this.x = x;
		this.y = y;
	}
	moveBy(x, y) {
		this.x += x;
		this.y += y;
	}
	show(mouseEvents = true) {
		this.shown = true;
		if(mouseEvents) {
			this.mouseEvents = true;
		}
		this.changedInMouseEvent = true;
	}
	hide(mouseEvents = true) {
		this.shown = false;
		if(mouseEvents) {
			this.mouseEvents = false;
		}
		this.changedInMouseEvent = true;
	}
	draw(ctx) {
		ctx.save();

		ctx.translate(Math.round(this.x), Math.round(this.y));

		this.drawI(ctx);

		ctx.restore();
	}
	_onMouseEnter() {
		for (const key in this.hover) {
			if(this.hasOwnProperty(key)) {
				this.beforeHover[key] = this[key];
				this[key] = this.hover[key];
			}
		}
		this.onMouseEnter();
	}
	_onMouseLeave() {
		for (const key in this.hover) {
			if(this.hasOwnProperty(key)) {
				this[key] = this.beforeHover[key];
				delete this.beforeHover[key];
			}
		}
		this.onMouseLeave();
	}
	_onClick() {
		this.onClick();
	}
	inMouseBox(x, y) {
		return false;
	}
	disableMouse() {
		this.mouseEvents = false;
	}
	enableMouse() {
		this.mouseEvents = true;
	}
	newPreSave(name, object) {
		this.preSaves[name] = object;
	}
	loadPreSave(name) {
		var save = this.preSaves[name];
		for (const key in save) {
			if(this.hasOwnProperty(key)) {
				this[key] = save[key];
			}
		}
	}
	get ax () { return this.px + this.x; }
	get ay () { return this.py + this.y; }
	get x () { return this._x; }
	set x (val) {
		this._x = val;

		this.changedInMouseEvent = true;
	}
	get y () { return this._y; }
	set y (val) {
		this._y = val;

		this.changedInMouseEvent = true;
	}
}

class Rect extends Element {
	constructor (id, width=10, height=10) {
		super(id, null);
		this.width = width;
		this.height = height;

		this.fillColor = 'black';
		this.origin = 'center'; // center | corner
		this.borderWidth = 0;
		this.borderColor = 'black';

		this.type = 'Rect';
	}
	draw(ctx) {
		ctx.save();
		ctx.globalAlpha = this.opacity;

		if(this.origin == 'center')
			ctx.translate(Math.round(this.x - this.width/2), Math.round(this.y - this.height/2));
		else
			ctx.translate(Math.round(this.x), Math.round(this.y));
		if(this.rotate != 0)
			ctx.rotate(this.rotate/180*Math.PI);

		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.borderColor;

		ctx.beginPath();

		ctx.rect(0, 0, this.width, this.height);
		if(this.fillColor != 'none')
			ctx.fill();
		if(this.borderColor != 'none')
			ctx.stroke();

		ctx.restore();
	}
	inMouseBox(x, y) {
		if(this.origin == 'center') {
			return x >= this.ax - this.width/2 && y >= this.ay - this.height/2 && x < this.ax + this.width/2 && y < this.ay + this.height/2;
		} else {
			return x >= this.ax && y >= this.ay && x < this.ax + this.width && y < this.ay + this.height;
		}
	}
	set border (border) {
		if(border == 'none') {
			this.borderWidth = 0;
			this.borderColor = 'none';
		} else {
			var bord = border.split(' ');
			this.borderWidth = bord[0];
			this.borderColor = bord[1];
		}
	}
}

class Group extends Element {
	constructor (id) {
		super(id, null);
		
		this.members = [];
		this.type = 'Group';
	}
	draw(ctx) {
		ctx.save();
		ctx.globalAlpha = this.opacity;

		ctx.translate(Math.round(this.x), Math.round(this.y));
		if(this.rotate != 0)
			ctx.rotate(this.rotate/180*Math.PI);

		this.members.sort((a, b) => Math.sign(a.z - b.z) || Math.sign(a.id - b.id));
		for (let i = 0; i < this.members.length; i++) {
			if(this.members[i].shown)
				this.members[i].draw(ctx);
		}

		ctx.restore();
	}
	moveTo(x, y) {
		this.x = x;
		this.y = y;
		for (let i = 0; i < this.members.length; i++) {
			this.members[i].px = this.x;
			this.members[i].py = this.y;	
		}
	}
	moveBy(x, y) {
		this.x += x;
		this.y += y;
		for (let i = 0; i < this.members.length; i++) {
			this.members[i].px = this.x;
			this.members[i].py = this.y;	
		}
	}
	show() {
		this.shown = true;
		for (let i = 0; i < this.members.length; i++) {
			this.members[i].show();
		}
		this.changedInMouseEvent = true;
	}
	hide() {
		this.false = true;
		for (let i = 0; i < this.members.length; i++) {
			this.members[i].hide();
		}
		this.changedInMouseEvent = true;
	}
}

class Text extends Element {
	constructor (id, text) {
		super(id, null);

		this.color = 'black';
		this.align = 'center';
		this.baseLine = 'middle';
		this.text = text;
		this.font = 'Arial';
		this.size = 16;
		this.type = 'Text';
	}
	draw(ctx) {
		ctx.save();
		ctx.globalAlpha = this.opacity;

		ctx.translate(Math.round(this.x), Math.round(this.y+this.size/4));
		if(this.rotate != 0)
			ctx.rotate(this.rotate/180*Math.PI);

		ctx.fillStyle = this.color;
		ctx.textAlign = this.align;
		ctx.textBaseline = this.baseLine;
		ctx.font = this.size + 'px ' + this.font;
		var txt = (this.text+'').split('\n');
		for (let i = 0; i < txt.length; i++) {
			ctx.fillText(txt[i], 0, -(txt.length-1)*this.size*0.6/2 + this.size*0.6*i);
		}

		ctx.restore();
	}
	
}

class Arrow extends Element {
	constructor (id) {
		super(id, null);

		this.dx = 0;
		this.dy = 0;

		this.arrowSize = 8;
		this.lineWidth = 2;

		this.color = 'black';
		this.type = 'Arrow';
	}
	draw(ctx) {
		ctx.save();
		ctx.globalAlpha = this.opacity;

		ctx.translate(Math.round(this.x), Math.round(this.y));
		if(this.rotate != 0)
			ctx.rotate(this.rotate/180*Math.PI);

		var angle = Math.atan2(this.dy, this.dx) + Math.PI;

		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.lineWidth;
		ctx.lineCap = 'round';

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(this.dx, this.dy);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(this.dx + Math.cos(angle - Math.PI/5) * this.arrowSize, this.dy + Math.sin(angle - Math.PI/5) * this.arrowSize);
		ctx.lineTo(this.dx, this.dy);
		ctx.lineTo(this.dx + Math.cos(angle + Math.PI/5) * this.arrowSize, this.dy + Math.sin(angle + Math.PI/5) * this.arrowSize);
		ctx.stroke();

		ctx.restore();
	}
	arrowTo(x, y) {
		this.dx = x;
		this.dy = y;
	}
}


class Arc extends Element {
	constructor (id, radius, angle) {
		super(id, null);

		this.lineColor = 'red';
		this.lineWidth = 2;
		
		this.fillColor = 'none';

		this.startAngle = 0; // starting angle
		this.angle = angle; // in degrees cause radians suck
		this.radius = radius;

		this.arrowEnd = false;
		this.arrowSize = 8;
		this.type = 'Arc';

		this.counterClock = false;
	}
	draw(ctx) {
		ctx.save();
		ctx.globalAlpha = this.opacity;

		ctx.translate(Math.round(this.x), Math.round(this.y));

		if(this.crop.length != 0) {
			ctx.beginPath();
			ctx.rect(this.crop[0], this.crop[1], this.crop[2], this.crop[3]);
			ctx.clip();
		}
		if(this.rotate != 0)
			ctx.rotate(this.rotate/180*Math.PI);

		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.lineColor;
		ctx.lineWidth = this.lineWidth;

		ctx.beginPath();
		ctx.arc(0, 0, this.radius, (this.startAngle-90)/180*Math.PI, ((this.startAngle + this.angle*((!this.counterClock)*2-1)) - 90)/180*Math.PI, this.counterClock);
		
		if(this.fillColor != 'none') 
			ctx.fill();
		if(this.lineColor != 'none') 
			ctx.stroke();

		if(this.arrowEnd == true) {
			var angle = ((this.startAngle + this.angle*((!this.counterClock)*2-1)) - 90*((!this.counterClock)*2-1))/180*Math.PI + Math.PI/2 + Math.PI;
			var dx = Math.cos((this.startAngle + this.angle*((!this.counterClock)*2-1) - 90)/180*Math.PI) * this.radius;
			var dy = Math.sin((this.startAngle + this.angle*((!this.counterClock)*2-1) - 90)/180*Math.PI) * this.radius;

			ctx.lineCap = 'round';

			ctx.beginPath();
			ctx.moveTo(dx + Math.cos(angle - Math.PI/5) * this.arrowSize, dy + Math.sin(angle - Math.PI/5) * this.arrowSize);
			ctx.lineTo(dx, dy);
			ctx.lineTo(dx + Math.cos(angle + Math.PI/5) * this.arrowSize, dy + Math.sin(angle + Math.PI/5) * this.arrowSize);
			ctx.stroke();

		}
		ctx.restore();
	}
	arrowTo(x, y) {
		this.dx = x;
		this.dy = y;
	}
	inMouseBox(x, y) {
		var dis = Math.sqrt((x - this.ax) * (x - this.ax) + (y - this.ay) * (y - this.ay));
		return dis <= this.radius; 
	}
}

class Img extends Element {
	constructor (id, src, width, height, onload=()=>{}) {
		super(id, null);

		this.width = width;
		this.height = height;

		this.image = new Image();
		this.image.src = src;
		this.image.addEventListener('load', () => { this.loaded = true; this.onload(); });
		
		this.onload = onload;
		this.loaded = false;
		this.origin = 'center'; // center | corner

		this.crop = 'none'; // eg [10, 10, 50, 50] // x, y, x2, y2
		this.type = 'Img';
	}
	draw(ctx) {
		ctx.save();
		ctx.globalAlpha = this.opacity;

		if(this.origin == 'center')
			ctx.translate(Math.round(this.x - this.width/2), Math.round(this.y - this.height/2));
		else
			ctx.translate(Math.round(this.x), Math.round(this.y));
		if(this.rotate != 0)
			ctx.rotate(this.rotate/180*Math.PI);
		
		if(this.crop == 'none')
			ctx.drawImage(this.image, 0, 0, this.width, this.height);
		else
			ctx.drawImage(this.image, this.crop[0], this.crop[1], this.crop[2], this.crop[3], 0, 0, this.width, this.height);

		ctx.restore();
	}
}
