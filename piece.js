/*
 * piece.js
 * Bestris
 * Davedude Games
 * Jan 2021
 */
class Piece {
	constructor (type) {
		this.x = 3; // Origin's X
		this.y = 1; // Origin's Y
		this.r = 0; // Rotation direction (0-3)
		this.lock = 0;
		this.isDropping = false;
		this.type = type;
		if(this.type == 0) { // I
			this.matrices = [		
				[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
				[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
				[[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
				[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]
			];
			this.color = 'cyan';
		} else if(this.type == 1) { // L
			this.matrices = [
				[[1,1,0],[0,1,0],[0,1,0]],
				[[0,0,0],[1,1,1],[1,0,0]],
				[[0,1,0],[0,1,0],[0,1,1]],
				[[0,0,1],[1,1,1],[0,0,0]]
			];
			this.color = 'blue';
		} else if(this.type == 2) { // J
			this.matrices = [
				[[0,1,0],[0,1,0],[1,1,0]],
				[[0,0,0],[1,1,1],[0,0,1]],
				[[0,1,1],[0,1,0],[0,1,0]],
				[[1,0,0],[1,1,1],[0,0,0]]
			];
			this.color = 'orange';
		} else if(this.type == 3) { // O
			this.matrices = [
				[[0,0,0],[1,1,0],[1,1,0],[0,0,0]],
				[[0,0,0],[1,1,0],[1,1,0],[0,0,0]],
				[[0,0,0],[1,1,0],[1,1,0],[0,0,0]],
				[[0,0,0],[1,1,0],[1,1,0],[0,0,0]],
			];
			this.color = 'yellow';
		} else if(this.type == 4) { // Z
			this.matrices = [
				[[0,1,0],[1,1,0],[1,0,0]],
				[[0,0,0],[1,1,0],[0,1,1]],
				[[0,0,1],[0,1,1],[0,1,0]],
				[[1,1,0],[0,1,1],[0,0,0]]
			];
			this.color = 'lime';
		} else if(this.type == 5) { // T
			this.matrices = [
				[[0,1,0],[1,1,0],[0,1,0]],
				[[0,0,0],[1,1,1],[0,1,0]],
				[[0,1,0],[0,1,1],[0,1,0]],
				[[0,1,0],[1,1,1],[0,0,0]]
			];
			this.color = 'purple';
		} else if(this.type == 6) { // S
			this.matrices = [
				[[1,0,0],[1,1,0],[0,1,0]],
				[[0,0,0],[0,1,1],[1,1,0]],
				[[0,1,0],[0,1,1],[0,0,1]],
				[[0,1,1],[1,1,0],[0,0,0]]
			];
			this.color = 'red';
		} else {
			console.log('oops');
		}
	}
	drop () {
		clearTimeout(int);
		this.isDropping = true;
		step();
	}
	gravity () {
		if(!this.testPush(0, 1, false)) { // If it hits a block
			this.lock++;
			if(this.lock == 3) {
				for(let i = 0; i < this.matrices[this.r].length; i++) {
					for(let j = 0; j < this.matrices[this.r][i].length; j++) {
						if(this.matrices[this.r][i][j] == 1) {
							grid[this.x+j][this.y+i] = this.type;
						}
					}
				}
				piece = false;
				draw();
				clearRows();
				//newPiece();
			}
		} else {
			if(!this.testPush(0, 1)) {
				this.isDropping = false;
			}
			this.lock = 0;
		}
	}
	move (dir) { // -1 or +1
		this.testPush(dir, 0, false);
	}
	testPush (dx, dy, reverse=true) {
		this.x += dx;
		this.y += dy;
		for(let i = 0; i < this.matrices[this.r].length; i++) {
			for(let j = 0; j < this.matrices[this.r][i].length; j++) {
				if((this.x+j < 0 || this.y+i < 0 || this.x+j >= 10 || this.y+i >= 21 || grid[this.x+j][this.y+i] != -1) && this.matrices[this.r][i][j] == 1) {
					
					this.x -= dx;
					this.y -= dy;
					return false;
				}
			}
		}
		if(reverse) {
			this.x -= dx;
			this.y -= dy;
		}
		return true;
	}
	rotate (minmax) {
		var oldr = this.r;
		this.r += minmax;
		if(this.r > 3) this.r = 0;
		if(this.r < 0) this.r = 3;
		if(piece.type == 0) {
			var pushes = [[[0,0],[-2,0],[1,0],[-2,-1],[1,2]], [[0,0],[-1,0],[2,0],[-1,2],[2,-1]], [[0,0],[-1,0],[2,0],[-1,2],[2,-1]], [[0,0],[2,0],[-1,0],[2,1],[-1,-2]], [[0,0],[2,0],[-1,0],[2,1],[-1,-2]], [[0,0],[1,0],[-2,0],[1,-2],[-2,1]], [[0,0],[1,0], [-2,0],[1,-2],[-2,1]], [[0,0],[-2,0],[1,0],[-2,-1],[1,2]]];
		} else {
			var pushes = [[[ 0, 0],[-1, 0],[-1, 1],[ 0,-2],[-1,-2]], [[ 0, 0],[ 1, 0],[ 1, 1],[ 0,-2],[ 1,-2]], [[ 0, 0],[ 1, 0],[ 1,-1],[ 0, 2],[ 1, 2]], [[ 0, 0],[ 1, 0],[ 1,-1],[ 0, 2],[ 1, 2]], [[ 0, 0],[ 1, 0],[ 1, 1],[ 0,-2],[ 1,-2]], [[ 0, 0],[-1, 0],[-1, 1],[ 0,-2],[-1,-2]], [[ 0, 0],[-1, 0],[-1,-1],[ 0, 2],[-1, 2]], [[ 0, 0],[-1, 0],[-1,-1],[ 0, 2],[-1, 2]]];
		}
		var n = oldr*2+(minmax==-1);
		for(var i = 0; i < pushes[n].length; i++) {
			if(this.testPush(pushes[n][i][0], pushes[n][i][1], 0)) {
				return;
			}
		}
		this.r = oldr;
	}
}