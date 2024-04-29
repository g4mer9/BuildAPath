class Shmup extends Phaser.Scene {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve1; curve2; curve3; curve4;
    path;
    gameActive;
    constructor(){
        super("pathMaker");
    }
    preload() {
        this.load.setPath("./assets/");                        // Set load path
        this.load.image("x-mark", "numeralX.png");             // x marks the spot
        this.load.image("enemyShip", "enemyGreen1.png");       // spaceship that runs along the path
        this.load.image("player", "character_squareRed.png");
        this.load.image("bullet", "effect_shot.png");
        this.load.image("cursor", "navigation_n.png");
        
    }
    create() {
        // Create a curve, for use with the path
        // Initial set of points are only used to ensure there is something on screen to begin with.
        // No need to save these values.
        this.points1 = [206, 13, 202, 178, 258, 282, 360, 316, 456, 356, 475, 433, 452, 490, 335, 521, 230, 507, 171, 438];
        this.points2 = [466, 13, 470, 178, 414, 282, 312, 316, 216, 356, 197, 433, 220, 490, 337, 521, 442, 507, 501, 438];
        this.points3 = [667, 610, 491, 556, 318, 534, 138, 537, 37, 607, 7, 735, 25, 836, 85, 848, 158, 804, 146, 724, 116, 635, 81, 520];
        this.points4 = [5, 610, 181, 556, 354, 534, 534, 537, 635, 607, 665, 735, 647, 836, 587, 848, 514, 804, 526, 724, 556, 635, 591, 520];
        this.curve1 = new Phaser.Curves.Spline(this.points1);
        this.curve1.points1 = this.points1;
        this.curve2 = new Phaser.Curves.Spline(this.points2);
        this.curve3 = new Phaser.Curves.Spline(this.points3);
        this.curve4 = new Phaser.Curves.Spline(this.points4);


        // Initialize Phaser graphics, used to draw lines
        this.graphics = this.add.graphics();
        this.gameActive = false;

        
        
        // Draw initial graphics
        this.xImages = [];
        this.drawLine();

        //onclick
        this.mouseDown = this.input.on('pointerdown', (pointer) => {
            console.log("click stuff here");
        });

        this.input.on('pointermove', pointer => {
            this.pointer = pointer;
        })

        my.sprite.player = this.add.sprite(300, 800, "player", "character_squareRed.png");
        my.sprite.player.visible = false;

        my.sprite.cursor = this.add.sprite(300, 800, "cursor", "navigation_n.png");
        my.sprite.cursor.visible = false;
        
        // Define key bindings
        this.ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //ADD SHIP TO ARRAY OF ACTIVE SHIPS
        my.sprite.enemyShip = this.add.follower(this.curve, 10, 10, "enemyShip");
        my.sprite.enemyShip.visible = false;

        document.getElementById('description').innerHTML = '<h2>Shmup.js</h2><br>ESC: Clear points <br>O - output points <br>R - run mode';
    }



    //DELETE ALL THIS LATER --------------------------------------------------------------------------------------------------------
    // Draws the spline
    drawLine() {
        this.graphics.clear();                      // Clear the existing line
        this.graphics.lineStyle(2, 0xffffff, 1);    // A white line
        this.curve1.draw(this.graphics, 32);         // Draw the spline
        this.curve2.draw(this.graphics, 32);         // Draw the spline
        this.curve3.draw(this.graphics, 32);         // Draw the spline
        this.curve4.draw(this.graphics, 32);         // Draw the spline
    }


    //---------------------------------------------------------------------------------------------------------------------------------------



    update() {
        if(this.gameActive) {

            if(this.pointer) {
                let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y);
                // Set the cursor's position relative to the player
                let distance = 50; // Distance from the center of the player to the cursor
                my.sprite.cursor.x = my.sprite.player.x + distance * Math.cos(angle);
                my.sprite.cursor.y = my.sprite.player.y + distance * Math.sin(angle);

                // Rotate cursor to face towards the calculated angle
                my.sprite.cursor.rotation = angle;

            }


            if(this.keyA.isDown && my.sprite.player.x > 25) {
                my.sprite.player.x -=9;
                my.sprite.cursor.x -= 9;
            } 

            else if(this.keyD.isDown && my.sprite.player.x < 650) {
                my.sprite.player.x +=9;
                my.sprite.cursor.x += 9;
            }

            if(this.keySpace.isDown && (my.sprite.bullet == undefined || my.sprite.bullet.scene == undefined) ) my.sprite.bullet = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "bullet", "effect_shot.png");
            //console.log(my.sprite.bullet)
            if(my.sprite.bullet != undefined) {
                my.sprite.bullet.y -= 10; 
                if(my.sprite.bullet.y <= 0) my.sprite.bullet.destroy(1);
            }
        }
        else if(this.ESCKey.isDown) {
            my.sprite.player.visible = true;
            my.sprite.cursor.visible = true;
            this.gameActive = true;
        }
    }

}