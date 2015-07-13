"use strict";
/* Global variables
 * establish the variables needed for functions in app.js 
 */
var	gameState = "title", 
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


/* Enemy Class
 * The villains in our game 
 */

// Create class with shared attribute (image) 
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
}

/* Title bug functions
 * Creates animation for title screen 
 */

// Update the title bug's position
Enemy.prototype.updateTitle = function(dt) {
	//straight path for first third
	if (this.x <= canvas.width/3){
		this.x += this.speed * dt;
	} else {
	//curved path to spot above title
		var arcR = canvas.height * 0.67;
		this.x += this.speed * dt;
		this.y =  Math.sqrt( arcR * arcR -  this.x * this.x) + 38;
	}
}

//Draw title bugs on screen
Enemy.prototype.renderTitle = function() {
	// Animate little bug
    if (this.y <= canvas.height) {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	// Turn little bug into giant bug after animation
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

/* Game bugs
 * The enemies rendered for game play 
 */

// Update the game bug's position
Enemy.prototype.update = function(dt) {
	this.x = (this.x % canvas.width ) + this.speed * dt;
}

// Draw the game bug on the screen
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/* Player Class
 * Our hero!
 */

// Create class with shared attributes (initial position, score, lives, default sprite)
var Player = function() {
	this.x = 200;
	this.y = 403;
	this.score = 0;
	this.lives = 3;
	this.sprite = 'images/char-boy.png'; 	//Add default sprite if no sprite is chosen
}

// Draw the player on the screen
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Move player based on keyboard input
Player.prototype.handleInput = function(key) {

	switch (key) {
		case "up":
			if (this.y > -12) {
			// Move one box up if below top of canvas
 				this.y -= 83; 
			} 
			break;

		case "down":
			if (this.y < 400) {
			// Move one box down if above bottom of grass
				this.y += 83;
			}
			break;

		case "left":
			if (this.x > -2) {
			 // Move one box left if left of canvas edge
				this.x -= canvas.width / 5;
			}
			break;

		case "right":
			if (this.x < 400) {
			// Move one box right if right of canvas edge
				this.x += canvas.width / 5;
			}
			break;
	}
}

// Send player back to starting position (used for reset after collision or continue game after "safe")
Player.prototype.reset = function() {
	this.x = 200;
	this.y = 403;
}

// Update player score
Player.prototype.addScore = function(scoreType) {
	
	if (scoreType === "gem") { 
	// Add 200 points for collecting gem
		this.score += 200;
	} else if (scoreType === "safe") { 
	// Add 1000 points for reaching the water
		this.score += 1000;
	}
}

/* Gem Class
 * Lovely treasures to collect!
 */
 
// Create class with shared attributes (randomly chosen color and location)
var Gem = function(){
	// Get random color
	this.sprite = gemOptions[Math.floor(Math.random() * gemOptions.length)];
	// Get random vertical position (line up on tiles within field)
	this.y = ( Math.floor(Math.random() * 3 )* 83  ) + 60;  // 
	// Get random horizontal position (line up on tiles within field)
	this.x =   Math.floor(Math.random() * 5 ) * canvas.width / 5; 
}

// Options for gem colors
var gemOptions = [
	'images/gem-blue-small.png',
	'images/gem-green-small.png',
	'images/gem-orange-small.png'
]

// Regenerate new gem when gem is collected
Gem.prototype.reset = function() {
	this.sprite = gemOptions[Math.floor(Math.random() * gemOptions.length)];
	this.y = ( Math.floor(Math.random() * 3 )* 83  ) + 60;  
	this.x = Math.floor(Math.random() * 5 ) * canvas.width / 5;
}

// Draw the gem the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/* Options Class
 * Choices when player reaches water ("safe" state)
 */
 
 // Create Option class
var Option = function(){
	// Set vertical placement of options
	this.y = 525;
}

// Set list of options at "safe" state
var gameOptions = [
	'Continue',
	'Start Over',
	'Quit'
]

// Render options on the canvas
Option.prototype.render = function() {
	ctx.textAlign = "center";
	ctx.font = "bold 18px Georgia";
	ctx.fillText(this.title, this.x, this.y );
	ctx.strokeStyle = "#000";
	ctx.lineWidth = 0.5;
	ctx.strokeText(this.title, this.x, this.y );
}

/* Game Functions
 * The stuff that makes the game work
 */

 // Set up game by  setting variables for initial game state and instantiating player, enemies, gems and game options
var instantiateAll = function() {
	// Initialize game state
	gameState = "title";
	gameReset = "null";

	// Instantiate bug for title screen animation
	titleBug = new Enemy()
	titleBug.x = 0;
	titleBug.y = canvas.height - 200;
	titleBug.speed = 400;

	// instantiate enemies
	for ( var i = 0; i < numEnemies; i++ ) {
		allEnemies[ i ] = new Enemy();
		allEnemies[ i ].y = i * 83 + 60;  //enemies line up on tiles
		allEnemies[ i ].x =  Math.random() * (canvas.width - 64); //enemies start at random positions on the x-axis
		allEnemies[ i ].speed = Math.random() * 200 + 10;
	}

	//instantiate game options
	for ( i = 0; i < numGems; i++) {
		allOptions[ i ] = new Option();
		allOptions[ i ].title = gameOptions[ i ];
		allOptions[ i ].x = ( i + 1) * canvas.width / 5 + 0.5 * canvas.width/5;
	}

	//instantiate gems
	for ( i = 0; i < numGems; i++) {
		allGems[ i ] = new Gem();
	}

	// Instantiate player options
	for ( i = 0; i < playerOptions.length; i++ ) {
		allPlayers[ i ] = new Player();
		allPlayers[ i ].y = 403;  //player options line up on bottom tiles
		allPlayers[ i ].x = i * canvas.width / 5;
		allPlayers[ i ].sprite = playerOptions[ i ];
	}

	// Instantiate player
	player = new Player();

	// Add event listener to choose player
	document.addEventListener("click", choosePlayer);
}
 
// Check to see if player has reached water
var checkSafe = function() {
	if ( player.y === -12 && gameState === "game" ) {
		gameState = "safe";
		player.addScore("safe");
	}
}

// Check to see if player has collided with enemy (boo!) or gem (yay!)
var checkCollisions = function() {
	
	// Check for collisions with bugs
	for( var i = 0; i < allEnemies.length; i++ ) {
		// If player's position is within area of enemy position a collision has occurred
		if (  Math.abs( allEnemies[ i ].x  -  player.x) < 50 && Math.abs( allEnemies[ i ].y  - player.y) < 50  ) {
			// Send the player back to the start block
			player.reset();
			// Reduce number of player lives
			player.lives = player.lives - 1;
			// If player has no more lives, game is over
			if ( player.lives < 1 ) {
				gameState = "gameOver";
			}
		}
	}
	
	// Check for collection of gems
	for( i = 0; i < allGems.length; i++ ) {
		// If player is on the same square as a gem, player collects the gem
		if (  Math.abs( allGems[ i ].x  -  player.x) < 50 && Math.abs( allGems[ i ].y  - player.y) < 50  ) {
			// Remove collected gem and put a new gem on the field
			allGems[ i ].reset();
			// Add gem to player score
			player.addScore("gem");
		}
	}
}

/* Event Listener Functions
 * Collects input from keyboard and mouse
 */

// Choose move using arrow keys
var chooseMove = function() {
	var allowedKeys = {
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};
	// Send results to player input function	
	player.handleInput(allowedKeys[event.keyCode]);
}

// Choose player using mouse
var choosePlayer = function() {
	// Get mouse position on canvas by adjusting for offset
	var mouseX = event.x - canvas.offsetLeft; 
	var mouseY = event.y - canvas.offsetTop;
	
	// Set location for width and top of target areas
	var spriteWidth = 101;
	var spriteTop = 450;
	
	// If mouse event is within range, check to see which character it points to
	if ( mouseY <= canvas.height && mouseY >= spriteTop ) {

		for ( var i = 0; i < playerOptions.length; i++ ) {
		// Set target area for each character
			var spriteLeft = spriteWidth * i;
			var spriteRight = spriteWidth * ( i + 1 );
			// Check if mouse event is in target area
			if ( mouseX >= spriteLeft && mouseX < spriteRight ) {
				// Set player's sprite to chosen character
				player.sprite = allPlayers[ i ].sprite;
				// Start the game
				gameState = "game";
				// Disable event listener (so character doesn't change by inadvertant mouse click)
				document.removeEventListener("click", choosePlayer);
			}
		}
	}

}

// Choose option at "safe" screen
var chooseOption = function() {
	// Get mouse position on canvas by adjusting for offset
	var mouseX = event.x - canvas.offsetLeft;
	var mouseY = event.y - canvas.offsetTop;
	
	//set target area top and width
	var optionWidth = 101;
	var optionTop = 450;

	// If mouse event is within range, check to see which option it points to
	if ( mouseY <= canvas.height && mouseY >= optionTop ) {

		for ( var i = 0; i < gameOptions.length; i++ ) {
			// Set target area for each option
			var optionLeft = optionWidth * ( i + 1 );
			var optionRight = optionWidth * ( i + 2 );
			// Check if mouse event is in target area
			if ( mouseX >= optionLeft && mouseX < optionRight ) {
				//set gameReset to chosen option
				gameReset = allOptions[ i ].title;
			}
		}
	}
}

/* Canvas Background and Text Functions
 * provide background images and text information on canvas
 */
	
// Set up needed variables
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

// Draw field for game play
var drawField = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for ( var row = 0; row < numRows; row++) {
		for ( var col = 0; col < numCols; col++) {
			ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
		}
	}
}

// Add text, score and image for Game Over canvas 
var drawGameOver = function() {
	// Game Over text
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
	//Chosen player image
	ctx.save();
	ctx.scale(1.75,1.75);
	ctx.drawImage(Resources.get(player.sprite), canvas.width * 0.4, canvas.height * 0.2);
	ctx.restore();
	//Thank you text
	ctx.font = "italic 24px Arial";
	ctx.fillText("Thank you for playing!", 0, canvas.height * 0.72 );
}

// Draw field with one row of grass for Title and Game Over canvases
var drawGrass = function() {
	// Create white background field
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.rect(0,0,canvas.height, canvas.width);
	ctx.fillStyle = "#fff";
	ctx.fill();
	//Draw row of grass at bottom
	var rowNum = 5;
	for ( var col = 0; col < numCols; col++) {
		ctx.drawImage(Resources.get(rowImages[rowNum]), col * 101, rowNum *83);
	}
}

// Add game play instructions at top of canvas
var drawInstructions = function() {
	ctx.textAlign = "center";
	ctx.font = "bold italic 24px Arial";
	ctx.fillStyle = "#963009";
	ctx.fillText( "Use arrow keys to move → ↓ ← ↑ ", canvas.width  / 2, 40);
}

// Add visual tracker for remaining lives
var drawLives = function() {
	ctx.textAlign = "right";
	ctx.fillStyle = "#963009";
	ctx.fillText( "Lives: ", canvas.width * 4 / 5, canvas.height );
	// Save canvas and scale image
	ctx.save();
	ctx.scale(0.2,0.2);
	// Add one mini sprite for each remaining life
	for ( var i = 0; i < player.lives; i++) {
		ctx.drawImage(Resources.get(player.sprite), canvas.width * 4 + i * 100, canvas.height * 4.75 );
	}
	// Restore canvas size
	ctx.restore();
}

// Add messages on "safe" canvas (when player has reached the water)
var drawSafeMsg = function() {
	// Congratulatory message
	ctx.textAlign = "center"; 
	ctx.font = "bold 50px Georgia";
	ctx.fillStyle = "#963009";
	ctx.fillText("YOU MADE IT!", canvas.width/2, 450 );
	// Instructins to click on Game Option (Continue/Start Over/Quit)
	ctx.font = "italic 24px Arial";
	ctx.fillStyle = "#963009";
	ctx.fillText("Click to choose", canvas.width/2, 500 );
	ctx.strokeStyle = "#000";
	ctx.lineWidth = 0.5;
	ctx.strokeText("Click to choose", canvas.width/2, 500 );
}

// Add player's current score at bottom of canvas
var drawScore = function() {
	ctx.textAlign = "left";
	ctx.font = "bold 24px Arial";
	ctx.fillStyle = "#963009";
	ctx.fillText( "Score: ", 0, canvas.height );
	ctx.fillText( player.score, canvas.width / 5, canvas.height );
}

// Add game title on title canvas
function drawTitle() {
	ctx.font = "48px Georgia";
	ctx.textAlign = "left";
	ctx.fillStyle = "#963009";
	ctx.fillText("Oh No!", 6, 200 );
	ctx.textAlign = "center";
	ctx.font = "bold 200px Georgia";
	ctx.fillText("Bugs", canvas.width/2, 350 );
}