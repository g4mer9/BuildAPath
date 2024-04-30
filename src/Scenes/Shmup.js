class Shmup extends Phaser.Scene {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve1; curve2; curve3; curve4;
    path;
    gameActive;
    gameFrame;
    lives;

    constructor(){
        super("pathMaker");
    }
    preload() {
        this.load.setPath("./assets/");                        // Set load path
        //this.load.image("x-mark", "numeralX.png");             // x marks the spot
        //this.load.image("enemyShip", "enemyGreen1.png");       // spaceship that runs along the path

        //player assets
        this.load.image("player_red", "player_red.png");
        this.load.image("player_blue", "player_blue.png");
        this.load.image("bullet_red", "laserRed12.png");
        this.load.image("bullet_blue", "laserBlue12.png");
        this.load.image("cursor", "navigation_n.png");

        //enemy assets
        this.load.image("e_blue", "shipBlue.png");
        this.load.image("e_blue_d", "shipBlue_damaged.png");
        this.load.image("e_red", "shipPink.png");
        this.load.image("e_red_d", "shipPink_damaged2.png");
        this.load.image("e_bullet_red", "laserRed09.png");
        this.load.image("e_bullet_blue", "laserBlue09.png");
        
        //effect assets
        this.load.image("burst_pink", "burst_pink.png");
        this.load.image("burst_blue", "burst_blue.png");
        
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
        this.curve2.points2 = this.points2;
        this.curve3 = new Phaser.Curves.Spline(this.points3);
        this.curve3.points3 = this.points3;
        this.curve4 = new Phaser.Curves.Spline(this.points4);
        this.curve4.points4 = this.points4;


        // Initialize Phaser graphics, used to draw lines
        this.graphics = this.add.graphics();
        this.gameActive = false;
        this.gameFrame = 0;
        this.lives = 3;

        
        
        // Draw initial graphics
        this.xImages = [];
        this.bullets = [];
        this.enemies = [];
        this.drawLine();

        //onclick
        this.mouseDown = this.input.on('pointerdown', (pointer) => {
            this.shoot();
        });

        this.input.on('pointermove', pointer => {
            this.pointer = pointer;
        })

        my.sprite.player = this.add.sprite(300, 800, "player_red", "player_red.png");
        my.sprite.player.color = "red";
        my.sprite.player.visible = false;

        my.sprite.cursor = this.add.sprite(300, 800, "cursor", "navigation_n.png");
        my.sprite.cursor.visible = false;
        
        // Define key bindings
        this.ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);//start
        //this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);//left
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);//right
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);//swap
        



        /** 
        //ADD SHIP TO ARRAY OF ACTIVE SHIPS
        my.sprite.enemyShip = this.add.follower(this.curve, 10, 10, "enemyShip");
        my.sprite.enemyShip.visible = false;**/

        document.getElementById('description').innerHTML = '<h2>Shmup.js | Inspired by Galaga and Ikaruga | Riley Fink</h2><br>ESC: Start Game <br>A - Move Left <br>D - move right <br>S - swap colors (invincible to bullets of that color + double damage to enemies of other color) <br>Left Click - shoot';
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



    shoot() {
        if(this.bullets.length < 5 && this.gameActive) {
            if(my.sprite.player.color == "red") my.sprite.bullet = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "bullet_red", "laserRed12.png");
            else my.sprite.bullet = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "bullet_blue", "laserBlue12.png");
            let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y);
            my.sprite.bullet.dir = angle;
            my.sprite.bullet.rotation = angle;
            this.bullets.push(my.sprite.bullet);
        }
    }

    update() {
        if(this.gameActive) {
            //console.log(string())

            if(this.pointer) {
                let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y);
                // Set the cursor's position relative to the player
                let distance = 50; // Distance from the center of the player to the cursor
                my.sprite.cursor.x = my.sprite.player.x + distance * Math.cos(angle);
                my.sprite.cursor.y = my.sprite.player.y + distance * Math.sin(angle);

                // Rotate cursor to face towards the calculated angle
                my.sprite.cursor.rotation = angle;

            }

            if(Phaser.Input.Keyboard.JustDown(this.keyS)) {
                if(my.sprite.player.color == "red") {
                    my.sprite.player.color = "blue";
                    my.sprite.player.setTexture("player_blue");
                }
                else {
                    my.sprite.player.color = "red";
                    my.sprite.player.setTexture("player_red");
                }
            }


            if(this.keyA.isDown && my.sprite.player.x > 25) {
                my.sprite.player.x -=9;
                my.sprite.cursor.x -= 9;
            } 

            else if(this.keyD.isDown && my.sprite.player.x < 650) {
                my.sprite.player.x +=9;
                my.sprite.cursor.x += 9;
            }

            if(this.pointer) {
                let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y);
                my.sprite.player.rotation = angle;
            }

            //console.log(this.bullets.length);
            //console.log(my.sprite.bullet)
            if(this.bullets.length != 0) for (let i = this.bullets.length - 1; i >= 0; i--) {
                let b = this.bullets[i];
                //console.log(b.y)
                //b.y -= 10; 

                b.x += 25 * Math.cos(b.dir);
                b.y += 25 * Math.sin(b.dir);

                if(b.y <= 0 || b.x >= 672 || b.x <= 0 || b.y >= 864) {
                    b.destroy(1);
                    this.bullets.splice(i, 1);
                }
            }
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                let e = this.enemies[i];
                
                e.startFollow({from: 0, to: 1, delay: 0, duration: 2000, ease: 'Sine.easeInOut', repeat: -1, yoyo: true, rotateToPath: true, rotationOffset: -90});
            }
    
            //GAME PROGRESSION LOGIC====================================================================================================
    
            switch(this.gameFrame) {
                case 60:
                    for(let i = 0; i < 3; i++) {
                        my.sprite.enemy = this.add.follower(this.curve1, this.curve1.points1[0].x, (this.curve1.points1[0].y), "e_blue");
                        //his.add.sprite(this.curve1.points1[0].x, (this.curve1.points1[0].y - (50 * (i+1))), "e_blue", "shipBlue.png");
                        this.enemies.push(my.sprite.enemy);
                    }
                    break;
            }

            this.gameFrame++;
        }
        else if(this.ESCKey.isDown) {
            my.sprite.player.visible = true;
            my.sprite.cursor.visible = true;
            this.gameActive = true;
        }

    }

}