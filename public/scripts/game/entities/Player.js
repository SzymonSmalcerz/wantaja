console.log("XD");

let Player = function(game,x,y){
  Phaser.Sprite.call(this,game,x,y,"character");
  game.add.existing(this);
  this.anchor.setTo(0.5);
  game.physics.enable(this);
  this.speed = 150;
  this.cursors = game.input.keyboard.createCursorKeys();

  this.animations.add("goLeft", [9,10,11,12,13,14,15,16,17], 10);
  this.animations.add("goRight", [27,28,29,30,31,32,33,34,35], 10);
  this.animations.add("goUp", [0,1,2,3,4,5,6,7,8], 10);
  this.animations.add("goDown", [18,19,20,21,22,23,24,25,26], 10);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {


    this.body.velocity.setTo(0);
  if(this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
    this.body.velocity.y = -this.speed;
    this.animations.play("goUp");
  } else if(this.cursors.down.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.S)){
    this.body.velocity.y = this.speed;
    this.animations.play("goDown");
  }  else if(this.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A)){
    this.body.velocity.x = -this.speed;
    this.animations.play("goLeft");
  }  else if(this.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D)){
    this.body.velocity.x = this.speed;
    this.animations.play("goRight");
  } else {
    this.animations.stop();
  }
}
