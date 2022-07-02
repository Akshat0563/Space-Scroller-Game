const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//setting the canvas to full screen in order
//make the drawings in it belong to defined size
canvas.width = 1024;
canvas.height = 576;
const gravity = 1.5; //rather than having a velocity ,i'm gicing acceleration
//so that it looks like realistic draw
//a player will be dealth as an object
class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 66;
    this.height = 150;
    this.image = createImage("./img/spriteStandRight.png");
    this.frames = 0;
    //
    this.sprites = {
      stand: {
        right: createImage("./img/spriteStandRight.png"),
        left: createImage("./img/spriteStandLeft.png"),
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: createImage("./img/spriteRunRight.png"),
        left: createImage("./img/spriteRunLeft.png"),
        cropWidth: 341,
        width: 127.875,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  //For drawing the game we will be using a
  //fill rectangle on the ontext of canvas
  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0;
    }
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    //after everytime updating the position with value
    //updating the velocity as well

    //check so that if the player reaches the end of the
    //canvas it stops falling
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}

//Platform class to felicitate the patforms
class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

//For non-interacting object

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

//image provided by javascript
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

let platformImage = createImage("./img/platform.png");
let platformSmallTallImage = createImage("./img/platformSmallTall.png");
let flagPoleImage = createImage("./img/flagPole.png");
//creating an object
let player = new Player();
let platforms = [];

//creating generic Objects

let genericObjects = [];

//for transitions
let lastKey;

//defining the movement in case for the left and right key
let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

//This ScrollOffset is used to store the offset from start
let scrollOffset = 0;

function init() {
  platformImage = createImage("./img/platform.png");

  //creating an object
  player = new Player();
  platforms = [
    new Platform({
      x:
        platformImage.width * 4 +
        300 -
        2 +
        platformImage.width -
        platformSmallTallImage.width,
      y: 270,
      image: platformSmallTallImage,
    }),
    new Platform({
      x:
        platformImage.width * 7 +
        800 -
        2 +
        platformImage.width -
        platformSmallTallImage.width,
      y: 270,
      image: platformSmallTallImage,
    }),
    new Platform({ x: -1, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width - 2, y: 470, image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 3 + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 4 + 300 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 5 + 800 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 6 + 500 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 7 + 800 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 8 + 1200 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 9 + 1200 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 9 + 1000 - 50,
      y: canvas.height - platformImage.height - flagPoleImage.height + 20,
      image: flagPoleImage,
    }),
  ];

  //creating generic Objects

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage("./img/background.png"),
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage("./img/hills.png"),
    }),
  ];

  //defining the movement in case for the left and right key
  keys = {
    right: {
      pressed: false,
    },
    left: {
      pressed: false,
    },
  };

  //This ScrollOffset is used to store the offset from start
  scrollOffset = 0;
}

//after initializing the player i'm calling the animate function
//which is just looping and updating the square animation and
//lookinh like the square is dropping
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  //in this animation only we will handle right and left

  if (
    (keys.right.pressed && player.position.x < 400) ||
    (keys.right.pressed &&
      scrollOffset === platformImage.width * 10 + 100 &&
      player.position.x <= platformImage.width * 10 + 100)
  ) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -1 * player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed && scrollOffset < platformImage.width * 10 + 100) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }

  //This is the collision detection system
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  //This is for the transition between the sprites
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  //WIN condition
  if (scrollOffset >= platformImage.width * 10) {
    console.log("You Win ");
    init();
  }

  //LOSE condition
  if (player.position.y > canvas.height) {
    //restart the game
    init();
  }
}
init();
animate();

//In this event listener the keydown event will recognize every keyboard
//and the event mein keyCode will tell which key is pressed
//keycode ko we can directly take by destructuring

addEventListener("keydown", ({ key }) => {
  console.log(key);
  switch (key) {
    case "a":
      keys.left.pressed = true;
      lastKey = "left";
      break;

    case "s":
      break;

    case "d":
      keys.right.pressed = true;
      //updating the player sprite to run
      lastKey = "right";
      break;

    case "w":
      player.velocity.y -= 25; //this moves player up
      break;
  }
});

//when the key is left the movement in x must stop this
//can be taken cake using the keyup event listener

addEventListener("keyup", ({ key }) => {
  console.log(key);
  switch (key) {
    case "a":
      keys.left.pressed = false;

      break;

    case "s":
      break;

    case "d":
      keys.right.pressed = false;
      break;

    case "w":
      break;
  }
});
