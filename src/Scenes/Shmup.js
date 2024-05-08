class Shmup extends Phaser.Scene {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve1; curve2; curve3; curve4;
    path;
    gameActive;
    gameFrame;
    lives;
    actionable = 0;
    txt = undefined;
    lives_txt = undefined;
    speed= 500;
    score = 0;

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
        this.load.audio('sfx_player_laser', 'laserRetro_000.ogg');
        this.load.audio('sfx_explosion', 'explosionCrunch_000.ogg');
        this.load.audio('sfx_respawn', 'forceField_000.ogg');
        this.load.audio('sfx_swap', 'laserRetro_003.ogg');

        //enemy assets
        this.load.image("e_blue", "shipBlue.png");
        this.load.image("e_blue_d", "shipBlue_damaged.png");
        this.load.image("e_red", "shipPink.png");
        this.load.image("e_red_d", "shipPink_damaged2.png");
        this.load.image("e_bullet_red", "laserRed09.png");
        this.load.image("e_bullet_blue", "laserBlue09.png");
        this.load.audio('sfx_enemy_laser', 'laserLarge_000.ogg');
        this.load.audio('sfx_enemy_damaged', 'laserSmall_004.ogg');
        
        //effect assets
        this.load.image("burst_pink", "burst_pink.png");
        this.load.image("burst_blue", "burst_blue.png");
        
    }
    create() {
        // Create a curve, for use with the path
        // Initial set of points are only used to ensure there is something on screen to begin with.
        // No need to save these values.
        this.txt = this.add.text(180, 400, "Game Over - Press ESC", { font: '32px Press Start 2P'});
        this.lives_txt = this.add.text(70, 10, "      Lives: 3 | Score: " + this.score);

        this.points1 = [400, 13, 90, 178, 180, 282, 360, 316, 456, 356, 475, 433, 452, 490, 335, 521, 230, 507, 171, 438];
        this.points2 = [272, 13, 582, 178, 492, 282, 312, 316, 216, 356, 197, 433, 220, 490, 337, 521, 442, 507, 501, 438];
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
        //this.graphics = this.add.graphics();
        this.gameActive = false;
        this.gameFrame = 0;
        this.lives = 3;

        
        
        // Draw initial graphics
        this.xImages = [];
        this.bullets = [];
        this.e_bullets = [];
        this.enemies = [];
        //this.drawLine();

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


    collides(a, b) 
    // a & b are sprites/
    // gameObjs(AABBs)
    {
        //red("x check: " + (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) + ", " + (a.x - b.x) + " > " + (a.displayWidth / 2 + b.displayWidth / 2))
        //red("y check: " + (Math.abs(a.y - b.y) > (a.displayHeight + b.displayHeight)))
    if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2 - 10))return false;

    if (Math.abs(a.y - b.y) > (a.displayHeight + b.displayHeight - 10)) return false;

    return true;
    }

    e_shoot(enemy) {
        if(this.e_bullets.length < 10 && this.gameActive && this.actionable ==0) {
            if(enemy.color == "red") {my.sprite.bullet = this.add.sprite(enemy.x, enemy.y, "e_bullet_red"); my.sprite.bullet.color = "red";}
            else {my.sprite.bullet = this.add.sprite(enemy.x, enemy.y, "e_bullet_blue"); my.sprite.bullet.color = "blue";}
            let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, my.sprite.player.x, my.sprite.player.y);
            my.sprite.bullet.dir = angle;
            my.sprite.bullet.setScale(.5);
            my.sprite.bullet.rotation = angle;
            this.e_bullets.push(my.sprite.bullet);
            this.sound.play('sfx_enemy_laser');
        }
    }


    shoot() {
        if(this.bullets.length < 3 && this.gameActive && this.actionable == 0) {
            if(my.sprite.player.color == "red") {my.sprite.bullet = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "bullet_red"); my.sprite.bullet.color = "red";}
            else {my.sprite.bullet = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "bullet_blue"); my.sprite.bullet.color = "blue";}
            let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y);
            my.sprite.bullet.dir = angle;
            my.sprite.bullet.setScale(.5);
            my.sprite.bullet.rotation = angle;
            this.bullets.push(my.sprite.bullet);
            this.sound.play('sfx_player_laser');
        }
    }

    update() {
        if(this.gameActive) {
            //red(string())
            if(this.actionable != 0 && this.gameFrame - this.actionable > 30) {
                if(this.e_bullets.length != 0) for (let i = this.e_bullets.length - 1; i >= 0; i--) {
                    let b = this.e_bullets[i];
                    this.e_bullets.splice(i, 1);
                    b.destroy(1); 
                }
                this.actionable = 0;
                my.sprite.player.visible = true;
                my.sprite.cursor.visible = true;
            }

            if(this.actionable == 0 && this.pointer) {
                let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y);
                // Set the cursor's position relative to the player
                let distance = 50; // Distance from the center of the player to the cursor
                my.sprite.cursor.x = my.sprite.player.x + distance * Math.cos(angle);
                my.sprite.cursor.y = my.sprite.player.y + distance * Math.sin(angle);

                // Rotate cursor to face towards the calculated angle
                my.sprite.cursor.rotation = angle;

            }

            if(this.actionable == 0 && Phaser.Input.Keyboard.JustDown(this.keyS)) {
                if(my.sprite.player.color == "red") {
                    my.sprite.player.color = "blue";
                    my.sprite.player.setTexture("player_blue");
                }
                else {
                    my.sprite.player.color = "red";
                    my.sprite.player.setTexture("player_red");
                }
                this.sound.play('sfx_swap');
            }


            if(this.actionable == 0 && this.keyA.isDown && my.sprite.player.x > 25) {
                my.sprite.player.x -=18;
                my.sprite.cursor.x -= 18;
            } 

            else if(this.actionable == 0 && this.keyD.isDown && my.sprite.player.x < 650) {
                my.sprite.player.x +=18;
                my.sprite.cursor.x += 18;
            }

            if(this.actionable == 0 && this.pointer) {
                let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y);
                my.sprite.player.rotation = angle;
            }

            //red(this.bullets.length);
            //red(my.sprite.bullet)
            if(this.bullets.length != 0) for (let i = this.bullets.length - 1; i >= 0; i--) {
                let b = this.bullets[i];
                // red(this.bullets[i]);
                // red(b);
                //red(b.y)
                //b.y -= 10; 

                b.x += 30 * Math.cos(b.dir);
                b.y += 30 * Math.sin(b.dir);

                if(b.y <= 0 || b.x >= 672 || b.x <= 0 || b.y >= 864) {
                    
                    this.bullets.splice(i, 1);
                    b.destroy(1);
                }
                if(this.enemies.length != 0) for (let j = this.enemies.length - 1; j >= 0; j--) {
                    let e = this.enemies[j];
                    // red(this.enemies[j]);
                    // red(e);
                    if(this.collides(e, b) == true) {

                        if(e.color != b.color) e.health -= 2;
                        else e.health--;

                        if(e.health <= 0){
                            this.enemies.splice(j, 1);
                            e.destroy(1);
                            this.sound.play('sfx_explosion');
                            this.score += 100;
                            this.lives_txt.setText("      Lives: " + this.lives + " | Score: " + this.score);
                        }
                        else if(e.health < 3) {
                            if(e.color == "blue") e.setTexture("e_blue_d");
                            else e.setTexture("e_red_d");
                            this.sound.play('sfx_enemy_damaged');
                        }
                        this.bullets.splice(i, 1);
                        b.destroy(1);
                    }
                };

                
            }

            if(this.e_bullets.length != 0) for (let i = this.e_bullets.length - 1; i >= 0; i--) {
                let b = this.e_bullets[i];
                // red(this.bullets[i]);
                // red(b);
                //red(b.y)
                //b.y -= 10; 

                b.x += 20 * Math.cos(b.dir);
                b.y += 20 * Math.sin(b.dir);

                if(b.y <= 0 || b.x >= 672 || b.x <= 0 || b.y >= 864) {
                    
                    this.e_bullets.splice(i, 1);
                    b.destroy(1);
                }

                if(this.actionable ==0 && this.collides(my.sprite.player, b) == true) {
                    if(this.lives <= 1 && my.sprite.player.color != b.color){
                        this.sound.play('sfx_explosion');
                        this.lives = 0;
                        my.sprite.player.visible = false;
                        my.sprite.cursor.visible = false;
                        this.scene.restart();
                        //this.txt = this.add.text(180, 400, "Game Over - Press ESC",{ font: '32px Press Start 2P'});

                    }
                    else if(my.sprite.player.color != b.color) {
                        this.sound.play('sfx_explosion');
                        this.lives--;
                        this.lives_txt.setText("      Lives: " + this.lives + " | Score: " + this.score);
                        this.actionable = this.gameFrame;
                        my.sprite.player.visible = false;
                        my.sprite.cursor.visible = false;
                        if(this.bullets.length != 0) for (let i = this.bullets.length - 1; i >= 0; i--) {
                            let b = this.bullets[i];
                            this.bullets.splice(i, 1);
                            b.destroy(1);
                        }
                    }
                }
            }

            if(this.enemies.length != 0) for (let j = this.enemies.length - 1; j >= 0; j--) {
                
                let enemy = this.enemies[j];
                

                let prob = 1/90;
                if(Math.random() < prob) {
                    this.e_shoot(enemy)
                }

                if(enemy.delete == true) this.enemies.splice(j, 1);
                if (enemy.isMoving) {
                    
                    let dx = enemy.targetX - enemy.x;
                    let dy = enemy.targetY - enemy.y;
                    let angle = Math.atan2(dy, dx);
                    this.speed = 500; // Speed pixels per second
                    if (Phaser.Math.Distance.Between(enemy.x, enemy.y, enemy.targetX, enemy.targetY) < 10) this.speed = 50;
                    //red("before" + enemy.x);
                    enemy.x += this.speed * Math.cos(angle) * 30 / 1000;
                    enemy.y += this.speed * Math.sin(angle) * 30 / 1000;
                    //red("after" + enemy.x);
                    // Check if the enemy has reached the target
                    if (Phaser.Math.Distance.Between(enemy.x, enemy.y, enemy.targetX, enemy.targetY) <1) {
                        enemy.isMoving = false; // Stop moving once the target is close enough
                    }
                }
                else {
                    if(this.gameFrame % 60 < 30) enemy.x+= 2; 
                    //else if( this.gameFrame % 30 == 0) enemy.y += 10;
                    else enemy.x-= 2;
                }
            };
            /**for (let i = this.enemies.length - 1; i >= 0; i--) {
                let e = this.enemies[i];
                
                e.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: -1, yoyo: true, rotateToPath: true, rotationOffset: -90});
            }**/
    
//GAME PROGRESSION LOGIC===================================================================================================================================================================================================================
    
            switch(this.gameFrame) {
                case 60:
                    my.sprite.enemy = this.add.follower(this.curve1, this.points1[0], this.points1[1], "e_blue");
                    my.sprite.enemy.setScale(.5);
                    my.sprite.enemy.health = 4;
                    my.sprite.enemy.color = "blue"
                    this.enemies.push(my.sprite.enemy);
                    my.sprite.enemy.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
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
                            my.sprite.e.targetX = 80; // Target X position
                            my.sprite.e.targetY = 50; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 65:
                    my.sprite.enemy1 = this.add.follower(this.curve1, this.points1[0], this.points1[1], "e_blue");
                    my.sprite.enemy1.setScale(.5);
                    my.sprite.enemy1.health = 4;
                    my.sprite.enemy1.color = "blue"
                    this.enemies.push(my.sprite.enemy1);
                    my.sprite.enemy1.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
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
                            my.sprite.e.targetX = 180; // Target X position
                            my.sprite.e.targetY = 50; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 70:
                    my.sprite.enemy2 = this.add.follower(this.curve1, this.points1[0], this.points1[1], "e_blue");
                    my.sprite.enemy2.setScale(.5);
                    my.sprite.enemy2.health = 4;
                    my.sprite.enemy2.color = "blue"
                    this.enemies.push(my.sprite.enemy2);
                    my.sprite.enemy2.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
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
                            my.sprite.e.targetX = 280; // Target X position
                            my.sprite.e.targetY = 50; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 75:
                    my.sprite.enemy3 = this.add.follower(this.curve1, this.points1[0], this.points1[1], "e_blue");
                    my.sprite.enemy3.setScale(.5);
                    my.sprite.enemy3.health = 4;
                    my.sprite.enemy3.color = "blue"
                    this.enemies.push(my.sprite.enemy3);
                    my.sprite.enemy3.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy3.stopFollow();
                        my.sprite.enemy3.delete = true;
                        if(my.sprite.enemy3.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy3.x, my.sprite.enemy3.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy3.health;
                            my.sprite.e.color = my.sprite.enemy3.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy3.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 380; // Target X position
                            my.sprite.e.targetY = 50; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 80:
                    my.sprite.enemy4 = this.add.follower(this.curve1, this.points1[0], this.points1[1], "e_blue");
                    my.sprite.enemy4.setScale(.5);
                    my.sprite.enemy4.health = 4;
                    my.sprite.enemy4.color = "blue"
                    this.enemies.push(my.sprite.enemy4);
                    my.sprite.enemy4.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy4.stopFollow();
                        my.sprite.enemy4.delete = true;
                        if(my.sprite.enemy4.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy4.x, my.sprite.enemy4.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy4.health;
                            my.sprite.e.color = my.sprite.enemy4.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy4.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 480; // Target X position
                            my.sprite.e.targetY = 50; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 85:
                    my.sprite.enemy5 = this.add.follower(this.curve1, this.points1[0], this.points1[1], "e_blue");
                    my.sprite.enemy5.setScale(.5);
                    my.sprite.enemy5.health = 4;
                    my.sprite.enemy5.color = "blue"
                    this.enemies.push(my.sprite.enemy5);
                    my.sprite.enemy5.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy5.stopFollow();
                        my.sprite.enemy5.delete = true;
                        if(my.sprite.enemy5.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy5.x, my.sprite.enemy5.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy5.health;
                            my.sprite.e.color = my.sprite.enemy5.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy5.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 580; // Target X position
                            my.sprite.e.targetY = 50; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                

                case 180:
                    my.sprite.enemy6 = this.add.follower(this.curve2, this.points2[0], this.points2[1], "e_red");
                    my.sprite.enemy6.setScale(.5);
                    my.sprite.enemy6.health = 4;
                    my.sprite.enemy6.color = "red"
                    this.enemies.push(my.sprite.enemy6);
                    my.sprite.enemy6.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy6.stopFollow();
                        my.sprite.enemy6.delete = true;
                        if(my.sprite.enemy6.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy6.x, my.sprite.enemy6.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy6.health;
                            my.sprite.e.color = my.sprite.enemy6.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy6.destroy(1);
                            
                            //this.enemies.splice(0, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 80; // Target X position
                            my.sprite.e.targetY = 150; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 185:
                    my.sprite.enemy1 = this.add.follower(this.curve2, this.points2[0], this.points2[1], "e_red");
                    my.sprite.enemy1.setScale(.5);
                    my.sprite.enemy1.health = 4;
                    my.sprite.enemy1.color = "red"
                    this.enemies.push(my.sprite.enemy1);
                    my.sprite.enemy1.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy1.stopFollow();
                        my.sprite.enemy1.delete = true;
                        if(my.sprite.enemy1.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy1.x, my.sprite.enemy1.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy1.health;
                            my.sprite.e.color = my.sprite.enemy1.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy1.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 180; // Target X position
                            my.sprite.e.targetY = 150; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 190:
                    my.sprite.enemy8 = this.add.follower(this.curve2, this.points2[0], this.points2[1], "e_red");
                    my.sprite.enemy8.setScale(.5);
                    my.sprite.enemy8.health = 4;
                    my.sprite.enemy8.color = "red"
                    this.enemies.push(my.sprite.enemy8);
                    my.sprite.enemy8.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy8.stopFollow();
                        my.sprite.enemy8.delete = true;
                        if(my.sprite.enemy8.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy8.x, my.sprite.enemy8.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy8.health;
                            my.sprite.e.color = my.sprite.enemy8.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy8.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 280; // Target X position
                            my.sprite.e.targetY = 150; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 195:
                    my.sprite.enemy9 = this.add.follower(this.curve2, this.points2[0], this.points2[1], "e_red");
                    my.sprite.enemy9.setScale(.5);
                    my.sprite.enemy9.health = 4;
                    my.sprite.enemy9.color = "red"
                    this.enemies.push(my.sprite.enemy9);
                    my.sprite.enemy9.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy9.stopFollow();
                        my.sprite.enemy9.delete = true;
                        if(my.sprite.enemy9.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy9.x, my.sprite.enemy9.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy9.health;
                            my.sprite.e.color = my.sprite.enemy9.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy9.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 380; // Target X position
                            my.sprite.e.targetY = 150; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 200:
                    my.sprite.enemy10 = this.add.follower(this.curve2, this.points2[0], this.points2[1], "e_red");
                    my.sprite.enemy10.setScale(.5);
                    my.sprite.enemy10.health = 4;
                    my.sprite.enemy10.color = "red"
                    this.enemies.push(my.sprite.enemy10);
                    my.sprite.enemy10.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy10.stopFollow();
                        my.sprite.enemy10.delete = true;
                        if(my.sprite.enemy10.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy10.x, my.sprite.enemy10.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy10.health;
                            my.sprite.e.color = my.sprite.enemy10.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy10.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 480; // Target X position
                            my.sprite.e.targetY = 150; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 205:
                    my.sprite.enemy11 = this.add.follower(this.curve2, this.points2[0], this.points2[1], "e_red");
                    my.sprite.enemy11.setScale(.5);
                    my.sprite.enemy11.health = 4;
                    my.sprite.enemy11.color = "red"
                    this.enemies.push(my.sprite.enemy11);
                    my.sprite.enemy11.startFollow({from: 0, to: 1, delay: 0, duration: 1500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy11.stopFollow();
                        my.sprite.enemy11.delete = true;
                        if(my.sprite.enemy11.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy11.x, my.sprite.enemy11.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy11.health;
                            my.sprite.e.color = my.sprite.enemy11.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy11.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 580; // Target X position
                            my.sprite.e.targetY = 150; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                

                case 300:
                    my.sprite.enemy6 = this.add.follower(this.curve3, this.points3[0], this.points3[1], "e_blue");
                    my.sprite.enemy6.setScale(.5);
                    my.sprite.enemy6.health = 4;
                    my.sprite.enemy6.color = "blue"
                    this.enemies.push(my.sprite.enemy6);
                    my.sprite.enemy6.startFollow({from: 0, to: 1, delay: 0, duration: 2500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy6.stopFollow();
                        my.sprite.enemy6.delete = true;
                        if(my.sprite.enemy6.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy6.x, my.sprite.enemy6.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy6.health;
                            my.sprite.e.color = my.sprite.enemy6.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy6.destroy(1);
                            
                            //this.enemies.splice(0, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 80; // Target X position
                            my.sprite.e.targetY = 250; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 305:
                    my.sprite.enemy1 = this.add.follower(this.curve3, this.points3[0], this.points3[1], "e_blue");
                    my.sprite.enemy1.setScale(.5);
                    my.sprite.enemy1.health = 4;
                    my.sprite.enemy1.color = "blue"
                    this.enemies.push(my.sprite.enemy1);
                    my.sprite.enemy1.startFollow({from: 0, to: 1, delay: 0, duration: 2500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
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
                            my.sprite.e.targetX = 180; // Target X position
                            my.sprite.e.targetY = 250; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 310:
                    my.sprite.enemy8 = this.add.follower(this.curve3, this.points3[0], this.points3[1], "e_blue");
                    my.sprite.enemy8.setScale(.5);
                    my.sprite.enemy8.health = 4;
                    my.sprite.enemy8.color = "blue"
                    this.enemies.push(my.sprite.enemy8);
                    my.sprite.enemy8.startFollow({from: 0, to: 1, delay: 0, duration: 2500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy8.stopFollow();
                        my.sprite.enemy8.delete = true;
                        if(my.sprite.enemy8.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy8.x, my.sprite.enemy8.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy8.health;
                            my.sprite.e.color = my.sprite.enemy8.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy8.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 280; // Target X position
                            my.sprite.e.targetY = 250; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 315:
                    my.sprite.enemy9 = this.add.follower(this.curve3, this.points3[0], this.points3[1], "e_blue");
                    my.sprite.enemy9.setScale(.5);
                    my.sprite.enemy9.health = 4;
                    my.sprite.enemy9.color = "blue"
                    this.enemies.push(my.sprite.enemy9);
                    my.sprite.enemy9.startFollow({from: 0, to: 1, delay: 0, duration: 2500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy9.stopFollow();
                        my.sprite.enemy9.delete = true;
                        if(my.sprite.enemy9.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy9.x, my.sprite.enemy9.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy9.health;
                            my.sprite.e.color = my.sprite.enemy9.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy9.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 380; // Target X position
                            my.sprite.e.targetY = 250; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 320:
                    my.sprite.enemy10 = this.add.follower(this.curve3, this.points3[0], this.points3[1], "e_blue");
                    my.sprite.enemy10.setScale(.5);
                    my.sprite.enemy10.health = 4;
                    my.sprite.enemy10.color = "blue"
                    this.enemies.push(my.sprite.enemy10);
                    my.sprite.enemy10.startFollow({from: 0, to: 1, delay: 0, duration: 2500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy10.stopFollow();
                        my.sprite.enemy10.delete = true;
                        if(my.sprite.enemy10.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy10.x, my.sprite.enemy10.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy10.health;
                            my.sprite.e.color = my.sprite.enemy10.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy10.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 480; // Target X position
                            my.sprite.e.targetY = 250; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 325:
                    my.sprite.enemy11 = this.add.follower(this.curve3, this.points3[0], this.points3[1], "e_blue");
                    my.sprite.enemy11.setScale(.5);
                    my.sprite.enemy11.health = 4;
                    my.sprite.enemy11.color = "blue"
                    this.enemies.push(my.sprite.enemy11);
                    my.sprite.enemy11.startFollow({from: 0, to: 1, delay: 0, duration: 2500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy11.stopFollow();
                        my.sprite.enemy11.delete = true;
                        if(my.sprite.enemy11.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy11.x, my.sprite.enemy11.y, "e_blue");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy11.health;
                            my.sprite.e.color = my.sprite.enemy11.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy11.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 580; // Target X position
                            my.sprite.e.targetY = 250; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                
                case 425:
                    my.sprite.enemy6 = this.add.follower(this.curve4, this.points4[0], this.points4[1], "e_red");
                    my.sprite.enemy6.setScale(.5);
                    my.sprite.enemy6.health = 4;
                    my.sprite.enemy6.color = "red"
                    this.enemies.push(my.sprite.enemy6);
                    my.sprite.enemy6.startFollow({from: 0, to: 1, delay: 0, duration: 3500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy6.stopFollow();
                        my.sprite.enemy6.delete = true;
                        if(my.sprite.enemy6.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy6.x, my.sprite.enemy6.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy6.health;
                            my.sprite.e.color = my.sprite.enemy6.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy6.destroy(1);
                            
                            //this.enemies.splice(0, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 80; // Target X position
                            my.sprite.e.targetY = 350; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 430:
                    my.sprite.enemy1 = this.add.follower(this.curve4, this.points4[0], this.points4[1], "e_red");
                    my.sprite.enemy1.setScale(.5);
                    my.sprite.enemy1.health = 4;
                    my.sprite.enemy1.color = "red"
                    this.enemies.push(my.sprite.enemy1);
                    my.sprite.enemy1.startFollow({from: 0, to: 1, delay: 0, duration: 3500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy1.stopFollow();
                        my.sprite.enemy1.delete = true;
                        if(my.sprite.enemy1.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy1.x, my.sprite.enemy1.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy1.health;
                            my.sprite.e.color = my.sprite.enemy1.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy1.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 180; // Target X position
                            my.sprite.e.targetY = 350; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 435:
                    my.sprite.enemy8 = this.add.follower(this.curve4, this.points4[0], this.points4[1], "e_red");
                    my.sprite.enemy8.setScale(.5);
                    my.sprite.enemy8.health = 4;
                    my.sprite.enemy8.color = "red"
                    this.enemies.push(my.sprite.enemy8);
                    my.sprite.enemy8.startFollow({from: 0, to: 1, delay: 0, duration: 3500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy8.stopFollow();
                        my.sprite.enemy8.delete = true;
                        if(my.sprite.enemy8.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy8.x, my.sprite.enemy8.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy8.health;
                            my.sprite.e.color = my.sprite.enemy8.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy8.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 280; // Target X position
                            my.sprite.e.targetY = 350; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 440:
                    my.sprite.enemy9 = this.add.follower(this.curve4, this.points4[0], this.points4[1], "e_red");
                    my.sprite.enemy9.setScale(.5);
                    my.sprite.enemy9.health = 4;
                    my.sprite.enemy9.color = "red"
                    this.enemies.push(my.sprite.enemy9);
                    my.sprite.enemy9.startFollow({from: 0, to: 1, delay: 0, duration: 3500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy9.stopFollow();
                        my.sprite.enemy9.delete = true;
                        if(my.sprite.enemy9.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy9.x, my.sprite.enemy9.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy9.health;
                            my.sprite.e.color = my.sprite.enemy9.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy9.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 380; // Target X position
                            my.sprite.e.targetY = 350; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 445:
                    my.sprite.enemy10 = this.add.follower(this.curve4, this.points4[0], this.points4[1], "e_red");
                    my.sprite.enemy10.setScale(.5);
                    my.sprite.enemy10.health = 4;
                    my.sprite.enemy10.color = "red"
                    this.enemies.push(my.sprite.enemy10);
                    my.sprite.enemy10.startFollow({from: 0, to: 1, delay: 0, duration: 3500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy10.stopFollow();
                        my.sprite.enemy10.delete = true;
                        if(my.sprite.enemy10.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy10.x, my.sprite.enemy10.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy10.health;
                            my.sprite.e.color = my.sprite.enemy10.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy10.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 480; // Target X position
                            my.sprite.e.targetY = 350; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                case 450:
                    my.sprite.enemy11 = this.add.follower(this.curve4, this.points4[0], this.points4[1], "e_red");
                    my.sprite.enemy11.setScale(.5);
                    my.sprite.enemy11.health = 4;
                    my.sprite.enemy11.color = "red"
                    this.enemies.push(my.sprite.enemy11);
                    my.sprite.enemy11.startFollow({from: 0, to: 1, delay: 0, duration: 3500, ease: 'Sine.easeInOut', repeat: 0, yoyo: false, rotateToPath: false, rotationOffset: -80, onComplete: () => { 
                        my.sprite.enemy11.stopFollow();
                        my.sprite.enemy11.delete = true;
                        if(my.sprite.enemy11.health != 0) {
                            my.sprite.e = this.add.sprite(my.sprite.enemy11.x, my.sprite.enemy11.y, "e_red");
                            my.sprite.e.setScale(.5);
                            my.sprite.e.health = my.sprite.enemy11.health;
                            my.sprite.e.color = my.sprite.enemy11.color;
                            //let i = this.enemies.length - 1;
                            my.sprite.enemy11.destroy(1);
                            
                            //this.enemies.splice(1, 1);
                            this.enemies.push(my.sprite.e);
                            my.sprite.e.targetX = 580; // Target X position
                            my.sprite.e.targetY = 350; // Target Y position
                            my.sprite.e.isMoving = true;
                        }
                    }});
                    
                    break;
                

                }
            this.gameFrame++;
        }

        
        else if(this.ESCKey.isDown) {
            if(this.txt != undefined) this.txt.destroy();
            my.sprite.player.visible = true;
            my.sprite.cursor.visible = true;
            this.gameActive = true;
        }
        
    }
}

