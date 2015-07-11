/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
 
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    function update(dt) {
		switch (gameState) {
            case "title":
				updateEntities(dt);
                break;

            case "game":		
				updateEntities(dt);
				checkCollisions();
				checkWin();
				break;
				
			case "win":
				reset();
				break;
		}
    }

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
	 		

    function render() {	
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
		
		function drawGrass() {
			//create white field
			ctx.rect(0,0,canvas.height, canvas.width);
			ctx.fillStyle = "#fff";
			ctx.fill();
			
			//draw row of grass at bottom
			var rowNum = 5;
			for (col = 0; col < numCols; col++) {
				ctx.drawImage(Resources.get(rowImages[rowNum]), col * 101, rowNum *83);
			}
		}
	
		switch (gameState) {
            case "title":				

				drawGrass();
				//Title
				ctx.font = "48px Georgia";
				ctx.textAlign = "left";
				ctx.fillStyle = "#963009";
				ctx.fillText("Oh No!", 6, 200 );	
				ctx.textAlign = "center";
				ctx.font = "bold 200px Georgia";
				ctx.fillText("Bugs", canvas.width/2, 350 );
				ctx.font = "italic 25px Arial";
                //Press key to start
				ctx.fillText("Press any key to Start", canvas.width/2, 425 );
                break;

            case "game":
				drawField();
				break;
				
			case "win":
				drawField();	
				
				//Add  "Win!" message
				ctx.textAlign = "center";
				ctx.font = "bold 50px Georgia";
				ctx.fillText("YOU MADE IT!", canvas.width/2, 450 );
				break;
						
			case "gameOver":
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawGrass();
				//Game Over text
				ctx.fillStyle = "#963009";
				ctx.textAlign = "center";
				ctx.font = "bold 150px Georgia";
				ctx.fillText("GAME", canvas.width/2, 175 );
				ctx.fillText("OVER", canvas.width/2, 300 );
				//Thank you text				
				ctx.font = "italic 25px Arial";
				ctx.fillText("Thank you for playing!", canvas.width/2, 350 );	
				//Princess snd boy	
				ctx.drawImage(Resources.get('images/char-princess-girl.png'),25, 300);
				ctx.drawImage(Resources.get('images/char-boy.png'),380, 300);
                break;
			
		}
		renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
		if  (gameState === "title" ) {
            	titleBug.renderTitle();
		} else if (gameState != "gameOver" ){
			allGems.forEach(function(gem) {
				gem.render();
			});
			allEnemies.forEach(function(enemy) {
				enemy.render();
			});
			player.render();
		}
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        if (gameReset === "play") {
			gameState = "game";
			player.reset()
			gameReset = null;
		} else  if (gameReset === "quit") {
			gameState = "gameOver";
			render();
			win.cancelAnimationFrame(main);
		}
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
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

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
	global.canvas = canvas;
 
})(this);