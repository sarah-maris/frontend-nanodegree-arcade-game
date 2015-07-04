// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	this.x = (this.x % 505 ) + this.speed * dt;  	
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

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
for (i = 0; i < 3; i++ ) {
	allEnemies[ i ] = new Enemy(); 
	allEnemies[ i ].y = i * 83 + 60;  //enemies line up on tiles
	allEnemies[ i ].x =  Math.random() * (505 - 64); //enemies start at random positions on the x-axis
	allEnemies[ i ].speed = Math.random() * 200 + 10; 
}

// instantiate player
var player = new Player();

// listen for keypresses
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
