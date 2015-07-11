// ENEMY CLASS
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
}

//TITLE BUGS
// Update the title bug's position
Enemy.prototype.updateTitle = function(dt) {
	//straight path for first third
	if (this.x <= canvas.width/3){
		this.x += this.speed * dt;
	} else { 
	//curved path to spot above title
		this.x += this.speed * dt;
		arcR = 406;
		this.y =  Math.sqrt( arcR * arcR -  this.x * this.x) + 38;
	} 
}

//Draw title bugs on screen
Enemy.prototype.renderTitle = function() {
	//animate little bug
    if (this.y <= canvas.height) { 
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	//turn into giant bug after animation	
	} else {		
		ctx.save();
		ctx.scale(2,2);
		ctx.rotate(6);				
		ctx.drawImage(Resources.get(this.sprite),100, 10);
		ctx.restore();
		allPlayers.forEach(function(player) {
			player.render();
		});
	}		
}

// GAME ENEMIES
// Update the enemy's position
Enemy.prototype.update = function(dt) {
	this.x = (this.x % canvas.width ) + this.speed * dt;  	
}

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// PLAYER CLASS
var Player = function() {
	this.x = 200;
	this.y = 403;
}

Player.prototype.update = function(dt) {
	//NOT USED
}

Player.prototype.render = function() {
	//Add default sprite if no sprite is chosen
	if ( this.sprite ) { 
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	} else 
    ctx.drawImage(Resources.get('images/char-boy.png'), this.x, this.y);
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
				this.x -= canvas.width / 5;
			}
			break;

		case "right":
			if (this.x < 400) {
				this.x += canvas.width / 5;
			}
			break;
	}
}

// send player back to starting position
Player.prototype.reset = function() {	
	this.x = 200;
	this.y = 403;
}

// update player score
Player.prototype.score = function() {
	console.log("WIN!");
	alert ("you win!");
	this.reset();
}

//GEM Class 
var Gem = function(){
	this.sprite = gemOptions[Math.floor(Math.random() * gemOptions.length)];
	this.y = ( Math.floor(Math.random() * 3 )* 83  ) + 60;  // line up on tiles
	this.x =   Math.floor(Math.random() * 5 ) * canvas.width / 5; // start at random positions on the x-axis    * canvas.width / 5
}

var gemOptions = [
	'images/gem-blue-small.png',
	'images/gem-green-small.png',
	'images/gem-orange-small.png'
]

// Draw the gems the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//GAME FUNCTIONS
// Check to see if player has reached water
var checkWin = function() {
	if (player.y === -12 ) {
		gameState = "win";
		return true;
	} else return false;
}

var checkCollisions = function() {
	for(i = 0; i < allEnemies.length; i++ ) { 
		if (  Math.abs( allEnemies[ i ].x  -  player.x) < 50 && Math.abs( allEnemies[ i ].y  - player.y) < 50  ) {
			player.reset();
		}
	}
	for(i = 0; i < allGems.length; i++ ) { 
		if (  Math.abs( allGems[ i ].x  -  player.x) < 50 && Math.abs( allGems[ i ].y  - player.y) < 50  ) {
			console.log("got gem");
		}
	}
}

//EVENT LISTENERS
// listen for key presses
document.addEventListener('keyup', function(e) {
        switch (gameState) {
            case "title":
				gameState = "game";
				break;
			
			case "game":	
				var allowedKeys = {
						37: 'left',
						38: 'up',
						39: 'right',
						40: 'down'
					};
				player.handleInput(allowedKeys[e.keyCode]);
				break;
			
			case "win":
				var allowedKeys = {
						81: 'quit',
						80: 'play',
				};
				gameReset = allowedKeys[e.keyCode];
				break;
	}
});

document.addEventListener("click", choosePlayer);

function choosePlayer() {
	var mouseX = event.x - canvas.offsetLeft;
	var mouseY = event.y -canvas.offsetTop; 
	var spriteWidth = 101;
	var spriteTop = 450;
	
	if ( mouseY <= canvas.height && mouseY >= spriteTop ) {
		
		for (i = 0; i < playerOptions.length; i++ ) {
			
			var spriteLeft = spriteWidth * i;
			var spriteRight = spriteWidth * ( i + 1 );
			
			if ( mouseX >= spriteLeft && mouseX < spriteRight ) {
				player.sprite = allPlayers[ i ].sprite;
			}
		}
	} 
}

//INITIALIZE GAME
//initialize game state
var	gameState = "title";
var gameReset = "null";

// instantiate bug for title screen animation
var titleBug = new Enemy()
titleBug.x = 0;
titleBug.y = canvas.height - 200;
titleBug.speed = 100;

// instantiate enemies 
var allEnemies = [];
var numEnemies = 3;

for (i = 0; i < numEnemies; i++ ) {
	allEnemies[ i ] = new Enemy(); 
	allEnemies[ i ].y = i * 83 + 60;  //enemies line up on tiles
	allEnemies[ i ].x =  Math.random() * (canvas.width - 64); //enemies start at random positions on the x-axis
	allEnemies[ i ].speed = Math.random() * 200 + 10; 
}

// instantiate player options
var allPlayers = [];
var playerOptions = [
		'images/char-boy.png', 
		'images/char-cat-girl.png', 
		'images/char-horn-girl.png', 
		'images/char-princess-girl.png', 
		'images/char-pink-girl.png'
];

for (i = 0; i < playerOptions.length; i++ ) {
	allPlayers[ i ] = new Player(); 
	allPlayers[ i ].y = 403;  //player options line up on bottom tiles
	allPlayers[ i ].x = i * canvas.width / 5;
	allPlayers[ i ].sprite = playerOptions[ i ];
}

// instantiate player
var player = new Player();

//instantiate gems
var allGems = [];
for ( i = 0; i < 10; i++) {
	allGems[ i ] = new Gem();
}


//TODO: Remove event listeners when not needed (by game state)	
//TODO: add gems and scoring
//TODO: add key for slow down