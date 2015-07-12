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
		ctx.font = "italic 25px Arial"
		ctx.fillText("Click on a character to begin the game", canvas.width/2, 425 );
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
	this.score = 0;
	this.lives = 3;
	this.sprite = 'images/char-boy.png'; 	//Add default sprite if no sprite is chosen
}

Player.prototype.update = function(dt) {
	//NOT USED
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
Player.prototype.addScore = function(scoreType) {
	if (scoreType === "gem") {
		this.score += 200;
	} else if (scoreType === "safe") {
		this.score += 1000;
	}
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

Gem.prototype.reset = function() {
	this.sprite = gemOptions[Math.floor(Math.random() * gemOptions.length)];
	this.y = ( Math.floor(Math.random() * 3 )* 83  ) + 60;  // line up on tiles
	this.x = Math.floor(Math.random() * 5 ) * canvas.width / 5; // start at random positions on the x-axis    * canvas.width / 5
}

// Draw the gems the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//OPTIONS Class
var Option = function(){
	this.sprite = 'images/enemy-bug.png';
}

Option.prototype.render = function() {
    //ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	ctx.textAlign = "center";
	ctx.font = "bold 18px Georgia";
	//ctx.fillStyle = "#fff";
	ctx.fillText(this.title, this.x, this.y );
	ctx.strokeStyle = "#000";
	ctx.lineWidth = 0.5;
	ctx.strokeText(this.title, this.x, this.y );
}

var gameOptions = [
	'Continue',
	'Start Over',
	'Quit'
]

//GAME FUNCTIONS
// Check to see if player has reached water
var checkSafe = function() {
	if (player.y === -12 && gameState === "game") {
		gameState = "safe";
		player.addScore("safe");
	}
}

var checkCollisions = function() {
	for(i = 0; i < allEnemies.length; i++ ) {
		if (  Math.abs( allEnemies[ i ].x  -  player.x) < 50 && Math.abs( allEnemies[ i ].y  - player.y) < 50  ) {
			player.reset();
			player.lives = player.lives - 1;
		};
		if ( player.lives < 1 ) {
			gameState = "gameOver";
		}
	}
	for(i = 0; i < allGems.length; i++ ) {
		if (  Math.abs( allGems[ i ].x  -  player.x) < 50 && Math.abs( allGems[ i ].y  - player.y) < 50  ) {
			allGems[ i ].reset();
			player.addScore("gem");
		}
	}
}

//Event Listener functions
function chooseMove() {
	var allowedKeys = {
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};
	player.handleInput(allowedKeys[event.keyCode]);
}

function choosePlayer() {
	var mouseX = event.x - canvas.offsetLeft;
	var mouseY = event.y - canvas.offsetTop;
	var spriteWidth = 101;
	var spriteTop = 450;

	if ( mouseY <= canvas.height && mouseY >= spriteTop ) {

		for (i = 0; i < playerOptions.length; i++ ) {

			var spriteLeft = spriteWidth * i;
			var spriteRight = spriteWidth * ( i + 1 );

			if ( mouseX >= spriteLeft && mouseX < spriteRight ) {
				player.sprite = allPlayers[ i ].sprite;
				gameState = "game";
				document.removeEventListener("click", choosePlayer);
			}
		}
	}

}

function chooseOption() {
	var mouseX = event.x - canvas.offsetLeft;
	var mouseY = event.y - canvas.offsetTop;
	var optionWidth = 101;
	var optionTop = 450;

	if ( mouseY <= canvas.height && mouseY >= optionTop ) {

		for (i = 0; i < gameOptions.length; i++ ) {

			var optionLeft = optionWidth * ( i + 1 );
			var optionRight = optionWidth * ( i + 2 );

			if ( mouseX >= optionLeft && mouseX < optionRight ) {
				chosenOption = allOptions[ i ].title;
			}
		}
	}
	gameReset = chosenOption;
}

//Set global variables
var	gameState = "title", //move to top of file
	gameReset = "null",
	titleBug,
	allEnemies = [],
	numEnemies = 3,
	allPlayers = [],
	playerOptions = [
		'images/char-boy.png',
		'images/char-cat-girl.png',
		'images/char-horn-girl.png',
		'images/char-princess-girl.png',
		'images/char-pink-girl.png'
	],
	player,
	allGems = [],
	numGems = 3,
	allOptions = [];

var instantiateAll = function() {
	//initialize game state
	gameState = "title";
	gameReset = "null";

	// instantiate bug for title screen animation
	titleBug = new Enemy()
	titleBug.x = 0;
	titleBug.y = canvas.height - 200;
	titleBug.speed = 400;

	// instantiate enemies
	for (i = 0; i < numEnemies; i++ ) {
		allEnemies[ i ] = new Enemy();
		allEnemies[ i ].y = i * 83 + 60;  //enemies line up on tiles
		allEnemies[ i ].x =  Math.random() * (canvas.width - 64); //enemies start at random positions on the x-axis
		allEnemies[ i ].speed = Math.random() * 200 + 10;
	}

	// instantiate player options
	for (i = 0; i < playerOptions.length; i++ ) {
		allPlayers[ i ] = new Player();
		allPlayers[ i ].y = 403;  //player options line up on bottom tiles
		allPlayers[ i ].x = i * canvas.width / 5;
		allPlayers[ i ].sprite = playerOptions[ i ];
	}

	// instantiate player
	player = new Player();

	//instantiate gems
	for ( i = 0; i < numGems; i++) {
		allGems[ i ] = new Gem();
	}

	//instantiate game options
	for ( i = 0; i < numGems; i++) {
		allOptions[ i ] = new Option();
		allOptions[ i ].title = gameOptions[ i ];
		allOptions[ i ].x = ( i + 1) * canvas.width / 5 + .5 * canvas.width/5;
		allOptions[ i ].y = 525;
	}
	document.addEventListener("click", choosePlayer);
}

//Render background and text functions
var rowImages = [
	'images/water-block.png',   // Top row is water
	'images/stone-block.png',   // Row 1 of 3 of stone
	'images/stone-block.png',   // Row 2 of 3 of stone
	'images/stone-block.png',   // Row 3 of 3 of stone
	'images/grass-block.png',   // Row 1 of 2 of grass
	'images/grass-block.png'    // Row 2 of 2 of grass
	],
numRows = 6,
numCols = 5,
row, col;

function drawField() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (row = 0; row < numRows; row++) {
		for (col = 0; col < numCols; col++) {
			ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
		}
	}
}

function drawGameOver() {
	ctx.fillStyle = "#963009";
	ctx.textAlign = "center";
	ctx.font = "bold 150px Georgia";
	ctx.fillText("GAME", canvas.width/2, 175 );
	ctx.fillText("OVER", canvas.width/2, 300 );

	//Final Score
	ctx.textAlign = "left";
	ctx.font = "bold 36px Georgia";
	ctx.fillText( "Final Score: ", 0, canvas.height * 0.66 );
	ctx.fillText( player.score, canvas.width * 0.5, canvas.height * 0.66 )
	//Chosen player
	ctx.save();
	ctx.scale(1.75,1.75);
	ctx.drawImage(Resources.get(player.sprite), canvas.width * 0.4, canvas.height * 0.2);
	ctx.restore();
	//Thank you text
	ctx.font = "italic 24px Arial";
	ctx.fillText("Thank you for playing!", 0, canvas.height * 0.72 );
}

function drawGrass() {
	//create white field
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.rect(0,0,canvas.height, canvas.width);
	ctx.fillStyle = "#fff";
	ctx.fill();

	//draw row of grass at bottom
	var rowNum = 5;
	for (col = 0; col < numCols; col++) {
		ctx.drawImage(Resources.get(rowImages[rowNum]), col * 101, rowNum *83);
	}
}

function drawInstructions() {
	ctx.textAlign = "center";
	ctx.font = "bold italic 24px Arial";
	ctx.fillStyle = "#963009";
	ctx.fillText( "Use arrow keys to move → ↓ ← ↑ ", canvas.width  / 2, 40);
}

function drawLives() {
	ctx.textAlign = "right";
	ctx.fillStyle = "#963009";
	ctx.fillText( "Lives: ", canvas.width * 4 / 5, canvas.height );
	ctx.save();
	ctx.scale(0.2,0.2);
	for (var i = 0; i < player.lives; i++) {
		ctx.drawImage(Resources.get(player.sprite), canvas.width * 4 + i * 100, canvas.height * 4.75 );
	}
	ctx.restore();
}

function drawSafe() {
	ctx.textAlign = "center"; 
	ctx.font = "bold 50px Georgia";
	ctx.fillStyle = "#963009";
	ctx.fillText("YOU MADE IT!", canvas.width/2, 450 );
	ctx.font = "italic 24px Arial";
	ctx.fillStyle = "#963009";
	ctx.fillText("Click to choose", canvas.width/2, 500 );
	ctx.strokeStyle = "#000";
	ctx.lineWidth = 0.5;
	ctx.strokeText("Click to choose", canvas.width/2, 500 );
}

function drawScore() {
	ctx.textAlign = "left";
	ctx.font = "bold 24px Arial";
	ctx.fillStyle = "#963009";
	ctx.fillText( "Score: ", 0, canvas.height );
	ctx.fillText( player.score, canvas.width / 5, canvas.height );
}

function drawTitle() {
	ctx.font = "48px Georgia";
	ctx.textAlign = "left";
	ctx.fillStyle = "#963009";
	ctx.fillText("Oh No!", 6, 200 );
	ctx.textAlign = "center";
	ctx.font = "bold 200px Georgia";
	ctx.fillText("Bugs", canvas.width/2, 350 );
}



//TODO: Add score and player to Game Over state
//TODO: Clean up code and lint and add strict