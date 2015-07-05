// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position
Enemy.prototype.update = function(dt) {
	this.x = (this.x % canvas.width ) + this.speed * dt;  	
}

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Add player class
var Player = function() {
    this.sprite = 'images/char-boy.png';
	this.x = 200;
	this.y = 403;
}

Player.prototype.update = function(dt) {
	
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {

	switch (key) {
		case "up":
			if (this.y > -12) {
				this.y -= 83;
			} else {
				
			}
			break;

		case "down":
			if (this.y < 400) {
				this.y += 83;
			}
			break;				
			
		case "left":
			if (this.x > -2) {
				this.x -= 101;
			}
			break;

		case "right":
			if (this.x < 400) {
				this.x += 101;
			}
			break;	
		
	}
}

// instantiate enemies 
var allEnemies = [];
var numEnemies = 3;

for (i = 0; i < numEnemies; i++ ) {
	allEnemies[ i ] = new Enemy(); 
	allEnemies[ i ].y = i * 83 + 60;  //enemies line up on tiles
	allEnemies[ i ].x =  Math.random() * (canvas.width - 64); //enemies start at random positions on the x-axis
	allEnemies[ i ].speed = Math.random() * 200 + 10; 
}

// instantiate player
var player = new Player();

// listen for key presses
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

Player.prototype.reset = function() {	
	this.x = 200;
	this.y = 403;
}

Player.prototype.score = function() {
	console.log("WIN!");
	alert ("you win!");
	this.reset();
}


// Check to see if player has reached water
var checkWin = function() {
	if (player.y === -12 ) {
		return true;
	} else return false;
}

var checkCollisions = function() {
	for(i = 0; i < numEnemies; i++ ) { 
		if (  Math.abs( allEnemies[ i ].x  -  player.x) < 50 && Math.abs( allEnemies[ i ].y  - player.y) < 50  ) {
			player.reset();
		}
	}
}
//TODO: add game restart with delay and score when reach water
//TODO: add gems and scoring
//TODO: add key for slow down
//TODO: add start and game over screens