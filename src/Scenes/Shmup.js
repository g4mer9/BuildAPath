class Shmup extends Phaser.Scene {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve1; curve2; curve3; curve4;
    path;
    runMode;
    constructor(){
        super("pathMaker");
    }
    preload() {
        this.load.setPath("./assets/");                        // Set load path
        this.load.image("x-mark", "numeralX.png");             // x marks the spot
        this.load.image("enemyShip", "enemyGreen1.png");       // spaceship that runs along the path
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

        // Define key bindings
        this.ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.oKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        // Draw initial graphics
        this.xImages = [];
        this.drawPoints();
        this.drawLine();

        //onclick
        this.mouseDown = this.input.on('pointerdown', (pointer) => {
            console.log("click stuff here");
        });

        //ADD SHIP TO ARRAY OF ACTIVE SHIPS
        my.sprite.enemyShip = this.add.follower(this.curve, 10, 10, "enemyShip");
        my.sprite.enemyShip.visible = false;

        document.getElementById('description').innerHTML = '<h2>Shmup.js</h2><br>ESC: Clear points <br>O - output points <br>R - run mode';
    }



    //DELETE ALL THIS LATER --------------------------------------------------------------------------------------------------------


    // Draws an x mark at every point along the spline.
    drawPoints() {
        for (let point of this.curve1.points1) {
            this.xImages.push(this.add.image(point.x, point.y, "x-mark"));
        }
    }
    // Clear points
    // Removes all of the points, and then clears the line and x-marks
    clearPoints() {
        this.curve.points1 = [];
        this.graphics.clear();
        for (let img of this.xImages) {
            img.destroy();
        }
    }
    // Add a point to the spline
    addPoint(point) {
        this.curve.addPoint(point);
        this.xImages.push(this.add.image(point.x, point.y, "x-mark"));
    }
    // Draws the spline
    drawLine() {
        this.graphics.clear();                      // Clear the existing line
        this.graphics.lineStyle(2, 0xffffff, 1);    // A white line
        this.curve1.draw(this.graphics, 32);         // Draw the spline
    }


    //---------------------------------------------------------------------------------------------------------------------------------------



    update() {

        

    }

}