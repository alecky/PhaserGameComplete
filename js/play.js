var playState = {

    create: function () {
        'use strict';
        
        this.cursor = game.input.keyboard.createCursorKeys();
        
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        // Tell Phaser that the player will use the Arcade physics engine
        game.physics.arcade.enable(this.player);
        
        // Add vertical gravity to the player
        this.player.body.gravity.y = 500;
        
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        
        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin);
        this.coin.anchor.setTo(0.5, 0.5);
        
        this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });
        
        game.global.score = 0;
        
        this.createWorld();
        
        // Call 'addEnemy' every 2.2 seconds
        game.time.events.loop(2200, this.addEnemy, this);
    },
    update: function () {
        'use strict';
        // Tell Phaser that the player and the walls should collide
        game.physics.arcade.collide(this.player, this.walls);
        // This function is called 60 times per second 
        // It contains the game's logic
        this.movePlayer();
        if (!this.player.inWorld) {
            this.playerDie();
        }
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        
        // Make the enemies and walls collide
        game.physics.arcade.collide(this.enemies, this.walls);
        
        // Call the 'playerDie' function when the player and an enemy overlap
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
    },
    movePlayer: function () {
        'use strict';
        
        if (this.cursor.left.isDown) {// If the left arrow key is pressed 
            // Move the player to the left
            this.player.body.velocity.x = -200;
        } else if (this.cursor.right.isDown) {// If the right arrow key is pressed
            // Move the player to the right 
            this.player.body.velocity.x = 200;
        } else {// If neither the right or left arrow key is pressed
            // Stop the player 
            this.player.body.velocity.x = 0;
        }
        
        // If the up arrow key is pressed and the player is touching the ground
        if (this.cursor.up.isDown && this.player.body.touching.down) {
            // Move the player upward (jump) 
            this.player.body.velocity.y = -320;
        }
    },
    
    createWorld: function () {
        'use strict';
        // Create our wall group with Arcade physics 
        this.walls = game.add.group();
        this.walls.enableBody = true;

        // Create the 10 walls
        game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left 
        game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right
        
        game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left 
        game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right 
        game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left 
        game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left 
        game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);
          
        // Set all the walls to be immovable
        this.walls.setAll('body.immovable', true);
    },
    
    playerDie: function () {
        'use strict';
        // When the player dies, we go to the menu 
        game.state.start('menu');
    },
    
    takeCoin: function (player, coin) {
        'use strict';
        // New score variable
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score;
        this.updateCoinPosition();
    },
    
    updateCoinPosition: function () {
        'use strict';
        // Store all the possible coin positions in an array 
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, // Top row 
            {x: 60, y: 140}, {x: 440, y: 140}, // Middle row 
            {x: 130, y: 300}, {x: 370, y: 300} // Bottom row
        ], i, newPosition;
        
        // Remove the current coin position from the array
        // Otherwise the coin could appear at the same spot twice in a row 
        for (i = 0; i < coinPosition.length; i += 1) {
            if (coinPosition[i].x === this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }
          
        // Randomly select a position from the array
        newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length - 1)];
          
        // Set the new position of the coin
        this.coin.reset(newPosition.x, newPosition.y);
    },
    
    addEnemy: function () {
        'use strict';
        // Get the first dead enemy of the group 
        var enemy = this.enemies.getFirstDead();
        
        // If there isn't any dead enemy, do nothing
        if (!enemy) {
            return;
        }
        
        // Initialise the enemy
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    }
};
