/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 */

var Engine = (function(global) {
	//Declare and define needed variables
    var doc = global.document,
		win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

	// Game loop function: animates action on canvas
    function main() {
		// Create time delta to provide a constant to smooth animation in different browsers
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

		// Update events in game by calling functions using time delta parameter to keep animation smooth
        update(dt);
		
		// Render changes on screen
        render();

		// Update time variable to current time
        lastTime = now;

		 // Re-start loop (main function) when browser is ready for next frame
        win.requestAnimationFrame(main);
    };

	// Initialize game at start or when reset is called
    function init() {
        lastTime = Date.now();
		instantiateAll();
        main();
    }
    // Call functions needed for each game state    
    function update(dt) {
		switch (gameState) {
            case "title":
				updateEntities(dt);
                break;

            case "game":
				document.addEventListener('keyup', chooseMove);
				updateEntities(dt);
				checkCollisions();
				checkSafe();
				break;

			case "safe":
				reset();
				break;
		}
    }
	
    // Update entities needed in each game state 
    function updateEntities(dt) {
        switch (gameState) {
            case "title":
				titleBug.updateTitle(dt);
                break;

            case "game":
				allEnemies.forEach(function(enemy) {
					enemy.update(dt);
				});
				player.update();
				break;
		}
    }

    // Render background, text and entities needed for each game state 
    function render() {
		switch (gameState) {
            case "title":
				drawGrass();
				drawTitle()
                break;

            case "game":
				drawField();
				drawScore();
				drawLives();
				drawInstructions()
				break;

			case "safe":
				drawField();
				drawScore();
				drawLives();
				drawSafeMsg()
				break;

			case "gameOver":
				drawGrass();
				drawGameOver();
                break;

		}
		// Call for changes in entities
		renderEntities();
    }

    // Render entities needed for each game state 
    function renderEntities() {

		switch (gameState) {
            case "title":
            	titleBug.renderTitle();
				break;

			case "game":
				allGems.forEach(function(gem) {
					gem.render();
				});
				allEnemies.forEach(function(enemy) {
					enemy.render();
				});
				player.render();
				break;

			case "safe":
				allGems.forEach(function(gem) {
					gem.render();
				});
				allEnemies.forEach(function(enemy) {
					enemy.render();
				});
				allOptions.forEach(function(option) {
					option.render();
				});
				player.render();
				break;

		}
    }

    // Handle game reset options in "safe" state 
    function reset() {
		// Listen for click on game state options
		document.addEventListener("click", chooseOption);

		switch (gameReset) {
            case "Continue":
				document.removeEventListener("click", chooseOption);
				gameState = "game";
				player.reset()
				gameReset = null;
				break;

			case "Quit":
				document.removeEventListener("click", chooseOption);
				gameState = "gameOver";
				render();
				win.cancelAnimationFrame(main);
				break;

			case "Start Over":
				document.removeEventListener('keyup', chooseMove);
				document.removeEventListener("click", chooseOption);
				init();
				break;
		}
    }

    // Load images needed for game 
    Resources.load([  
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',  
        'images/enemy-bug.png',
        'images/char-boy.png',
		'images/char-cat-girl.png',
		'images/char-horn-girl.png',
		'images/char-princess-girl.png',
		'images/char-pink-girl.png',
		'images/gem-blue-small.png',
		'images/gem-green-small.png',
		'images/gem-orange-small.png'
    ]);
    Resources.onReady(init);

	// Make ctx and canvas available outside Engine function
    global.ctx = ctx;
	global.canvas = canvas;

})(this);