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
        //this.curve1.points1 = this.points1;
        this.curve2 = new Phaser.Curves.Spline(this.points2);
        //this.curve2.points2 = this.points2;
        this.curve3 = new Phaser.Curves.Spline(this.points3);
        //this.curve3.points3 = this.points3;
        this.curve4 = new Phaser.Curves.Spline(this.points4);
        //this.curve4.points4 = this.points4;


        // Initialize Phaser graphics, used to draw lines
        this.graphics = this.add.graphics();
        this.gameActive = false;
        this.gameFrame = 0;
        this.lives = 3;

        
        
        // Draw initial graphics
        this.xImages = [];
        this.bullets = [];
        this.e_bullets = [];
        this.enemies = [];
        this.drawLine();

        //onclick
        this.mouseDown = this.input.on('pointerdown', (pointer) => {
            this.shoot();
        });

        this.input.on('pointermove', pointer => {
            this.pointer = pointer;
        })

        my.sprite.player = this.add.sprite(300, 800, "player_red");
        my.sprite.player.color = "red";
        my.sprite.player.visible = false;

        my.sprite.cursor = this.add.sprite(300, 800, "cursor");
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



//DELETE ALL THIS LATER --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Draws the spline
    drawLine() {
        this.graphics.clear();                      // Clear the existing line
        this.graphics.lineStyle(2, 0xffffff, 1);    // A white line
        this.curve1.draw(this.graphics, 32);         // Draw the spline
        this.curve2.draw(this.graphics, 32);         // Draw the spline
        this.curve3.draw(this.graphics, 32);         // Draw the spline
        this.curve4.draw(this.graphics, 32);         // Draw the spline
    }


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    collides(a, b) 
    // a & b are sprites/
    // gameObjs(AABBs)
    {
        //console.log("x check: " + (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) + ", " + (a.x - b.x) + " > " + (a.displayWidth / 2 + b.displayWidth / 2))
        //console.log("y check: " + (Math.abs(a.y - b.y) > (a.displayHeight + b.displayHeight)))
    if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2))return false;

    if (Math.abs(a.y - b.y) > (a.displayHeight + b.displayHeight)) return false;

    return true;
    }

    e_shoot(enemy) {
        if(this.e_bullets.length < 5 && this.gameActive) {
            if(enemy.color == "red") {my.sprite.bullet = this.add.sprite(enemy.x, enemy.y, "e_bullet_red"); my.sprite.bullet.color = "red";}
            else {my.sprite.bullet = this.add.sprite(enemy.x, enemy.y, "e_bullet_blue"); my.sprite.bullet.color = "blue";}
            let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, my.sprite.player.x, my.sprite.player.y);
            my.sprite.bullet.dir = angle;
            my.sprite.bullet.setScale(.5);
            my.sprite.bullet.rotation = angle;
            this.e_bullets.push(my.sprite.bullet);
        }
    }


    shoot() {
        if(this.bullets.length < 5 && this.gameActive) {
            if(my.sprite.player.color == "red") {my.sprite.bullet = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "bullet_red"); my.sprite.bullet.color = "red";}
            else {my.sprite.bullet = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "bullet_blue"); my.sprite.bullet.color = "blue";}
            let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y);
            my.sprite.bullet.dir = angle;
            my.sprite.bullet.setScale(.5);
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
                my.sprite.player.x -=18;
                my.sprite.cursor.x -= 18;
            } 

            else if(this.keyD.isDown && my.sprite.player.x < 650) {
                my.sprite.player.x +=18;
                my.sprite.cursor.x += 18;
            }

            if(this.pointer) {
                let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y);
                my.sprite.player.rotation = angle;
            }

            //console.log(this.bullets.length);
            //console.log(my.sprite.bullet)
            if(this.bullets.length != 0) for (let i = this.bullets.length - 1; i >= 0; i--) {
                let b = this.bullets[i];
                // console.log(this.bullets[i]);
                // console.log(b);
                //console.log(b.y)
                //b.y -= 10; 

                b.x += 50 * Math.cos(b.dir);
                b.y += 50 * Math.sin(b.dir);

                if(b.y <= 0 || b.x >= 672 || b.x <= 0 || b.y >= 864) {
                    
                    this.bullets.splice(i, 1);
                    b.destroy(1);
                }
                if(this.enemies.length != 0) for (let j = this.enemies.length - 1; j >= 0; j--) {
                    let e = this.enemies[j];
                    // console.log(this.enemies[j]);
                    // console.log(e);
                    if(this.collides(e, b) == true) {
                        if(e.health <= 1 || e.color != b.color){
                            e.health = 0;
                            this.enemies.splice(j, 1);
                            e.destroy(1);
                        }
                        else {
                            e.health--;
                            if(e.color == "blue") e.setTexture("e_blue_d");
                            else e.setTexture("e_red_d");
                        }
                        this.bullets.splice(i, 1);
                        b.destroy(1);
                    }
                };

                
            }

            if(this.e_bullets.length != 0) for (let i = this.e_bullets.length - 1; i >= 0; i--) {
                let b = this.e_bullets[i];
                // console.log(this.bullets[i]);
                // console.log(b);
                //console.log(b.y)
                //b.y -= 10; 

                b.x += 20 * Math.cos(b.dir);
                b.y += 20 * Math.sin(b.dir);

                if(b.y <= 0 || b.x >= 672 || b.x <= 0 || b.y >= 864) {
                    
                    this.e_bullets.splice(i, 1);
                    b.destroy(1);
                }
            }

            if(this.enemies.length != 0) for (let j = this.enemies.length - 1; j >= 0; j--) {
                
                let enemy = this.enemies[j];
                console.log(this.enemies)

                let prob = 1/90;
                if(Math.random() < prob) {
                    this.e_shoot(enemy)
                }

                if(enemy.delete == true) this.enemies.splice(j, 1);
                if (enemy.isMoving) {
                    
                    let dx = enemy.targetX - enemy.x;
                    let dy = enemy.targetY - enemy.y;
                    let angle = Math.atan2(dy, dx);
                    let speed = 500; // Speed pixels per second
                    //console.log("before" + enemy.x);
                    enemy.x += speed * Math.cos(angle) * 30 / 1000;
                    enemy.y += speed * Math.sin(angle) * 30 / 1000;
                    //console.log("after" + enemy.x);
                    // Check if the enemy has reached the target
                    if (Phaser.Math.Distance.Between(enemy.x, enemy.y, enemy.targetX, enemy.targetY) < 10) {
                        enemy.isMoving = false; // Stop moving once the target is close enough
                    }
                }
                else {
                    if(this.gameFrame % 60 < 30) enemy.x+= 2;
                    else enemy.x-= 2;
                }
            };
            /**for (let i = this.enemies.length - 1; i >= 0; i--) {
                let e = this.enemies[i];
                
                e.startFollow({from: 0, to: 1, delay: 0, duration: 2000, ease: 'Sine.easeInOut', repeat: -1, yoyo: true, rotateToPath: true, rotationOffset: -90});
            }**/
    
//GAME PROGRESSION LOGIC===================================================================================================================================================================================================================
    
            switch(this.gameFrame) {
                case 60:
                    my.sprite.enemy = this.add.follower(this.curve1, this.points1[0], this.points1[1], "e_blue");
                    my.sprite.enemy.setScale(.5);
                    my.sprite.enemy.health = 2;
                    my.sprite.enemy.color = "blue"
                    this.enemies.push(my.sprite.enemy);
                    my.sprite.enemy.startFollow({from: 0, to: 1, delay: 0, duration: 2000, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -90, onComplete: () => { 
                        my.sprite.enemy.stopFollow();
                        my.sprite.enemy.delete = true;
                        if(my.sprite.enemy.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy.x, my.sprite.enemy.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy.health;
                            my.sprite.e.color = my.sprite.enemy.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy.destroy(1);
                            
                            //this.enemies.splice(0, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 50; // Target X position
                            my.sprite.e.targetY = 50; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 65:
                    my.sprite.enemy1 = this.add.follower(this.curve1, this.points1[0], this.points1[1], "e_blue");
                    my.sprite.enemy1.setScale(.5);
                    my.sprite.enemy1.health = 2;
                    my.sprite.enemy1.color = "blue"
                    this.enemies.push(my.sprite.enemy1);
                    my.sprite.enemy1.startFollow({from: 0, to: 1, delay: 0, duration: 2000, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -90, onComplete: () => { 
                        my.sprite.enemy1.stopFollow();
                        my.sprite.enemy1.delete = true;
                        if(my.sprite.enemy1.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy1.x, my.sprite.enemy1.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy1.health;
                            my.sprite.e.color = my.sprite.enemy1.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy1.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 150; // Target X position
                            my.sprite.e.targetY = 50; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 70:
                    my.sprite.enemy2 = this.add.follower(this.curve1, this.points1[0], this.points1[1], "e_blue");
                    my.sprite.enemy2.setScale(.5);
                    my.sprite.enemy2.health = 2;
                    my.sprite.enemy2.color = "blue"
                    this.enemies.push(my.sprite.enemy2);
                    my.sprite.enemy2.startFollow({from: 0, to: 1, delay: 0, duration: 2000, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -90, onComplete: () => { 
                        my.sprite.enemy2.stopFollow();
                        my.sprite.enemy2.delete = true;
                        if(my.sprite.enemy2.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy2.x, my.sprite.enemy2.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy2.health;
                            my.sprite.e.color = my.sprite.enemy2.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy2.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 250; // Target X position
                            my.sprite.e.targetY = 50; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
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

