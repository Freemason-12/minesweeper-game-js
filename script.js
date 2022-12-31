const field = document.getElementById("field")

class Cell {
	constructor() {
		this.isBomb = false;
		this.isOpen = false;
		this.nearbyBombs = 0;
		this.flagged = false;
		this.component = document.createElement("div");
		field.appendChild(this.component);
		this.component.classList.add("cell");
		this.nearbyCells = [];

		this.component.onclick = () => expandCell(this);
		this.component.oncontextmenu = () => {event.preventDefault();};
		let self = this;
		this.component.addEventListener('mouseup', (e) => flagCell(e, self));
	}
} 

// Adding cells to a field_____________________________________
let map = [];
let bombs = [];
let bombCount = 0;

for(let i = 0; i < 8; i++){
	let row = [];
	for(let j = 0; j < 8; j++){
		let cc = new Cell();
		row.push(cc);
	}
	map.push(row);
}

// Adding nearbyCells____________________________________________
for(let i = 0; i < 8; i++){
	for(let j = 0; j < 8; j++){
		let cc = map[i][j];

		for(let i1 = i - 1; i1 <= i + 1; i1++){
			for(let j1 = j - 1; j1 <= j + 1; j1++){

				if(i1 != i || j1 != j){
					if(typeof map[i1] != 'undefined'){
						if(typeof map[i1][j1] != 'undefined'){
							let cp = map[i1][j1];
							cc.nearbyCells.push(cp);
						}
					}
				} 

			}
		}

	}
}

// Bomb Generation____________________________________________
while(bombCount < 10){
	let x = Math.round(Math.random() * 7);
	let y = Math.round(Math.random() * 7);
	let cell = map[x][y];
	if(!cell.isBomb){
		bombs.push(cell);
		cell.isBomb = true;
		cell.component.onclick = bombExplode;
		bombCount++;
	}
}

// Counting nearbyBombs_____________________________________________
for(let i of map){
	for(let j of i){
		if(!j.isBomb)
			for(let k of j.nearbyCells) if(k.isBomb) j.nearbyBombs++;
	}
}

// Needed Functions_____________________________________________

function bombExplode() {
	for(let i of bombs){
		i.component.innerHTML = "<h2>*</h2>";
		console.log("Bomb");
	}
	gameover(false);
}

function expandCell(self) {
	self.isOpen = true;
	self.component.onclick = null; 
	self.component.classList.add("open");

	if(self.nearbyBombs > 0) {
		self.component.innerHTML = self.nearbyBombs;
		self.component.onclick = () => expandOpenCell(self);
	}
	else {
		for(let i of self.nearbyCells){
			if(i.flagged) {
				i.flagged = false;
				i.component.classList.remove("flagged");
				i.component.onclick = () => self.isBomb? bombExplode(): expandCell(self);
			}
			else if(!i.isOpen) {
				expandCell(i);
			}
		}
	}
	console.log(self);
}

function expandOpenCell(self) {
	let flags = 0;
	for(let i of self.nearbyCells) if(i.flagged) flags++;
	console.log(flags + " expanded");
	if(flags == self.nearbyBombs)
	for(let i of self.nearbyCells){
		if(!i.flagged && !i.isOpen){
			if(i.isBomb) bombExplode();
			else expandCell(i);
		}
	}
}

function flagCell(e, self) {
	console.log(e.button, self.flagged);
	console.log(self)
	if(e.button == 2) {
		if(!self.flagged){
			self.flagged = true;
			self.component.classList.add("flagged");
			self.component.onclick = null;
		}
		else {
			self.flagged = false;
			self.component.classList.remove("flagged");
			self.component.onclick = () => self.isBomb? bombExplode(): expandCell(self);
		}
		if(checkWin()) gameover(true);
	}
}

function checkWin(){
	for(i of bombs) if(!i.flagged) return false;
	return true;
}

function gameover(win){
	let gamePrompt = document.getElementById("gameover");
	gamePrompt.innerHTML = (win)? "<h1>You won</h1>": "<h1>You lost</h1>";
	gamePrompt.style.zIndex = 1;
}

//______________________________________________________________
console.log(bombs);
