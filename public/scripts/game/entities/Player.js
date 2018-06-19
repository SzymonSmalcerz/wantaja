console.log("XD");

let Player = function(game,data){

  Phaser.Sprite.call(this,game,data.x,data.y,"character");


  this.health = data.health;
  this.maxHealth = data.maxHealth;
  this.experience = data.experience;
  this.requiredExperience = data.requiredExperience;
  this.level = data.level;
  this.id = data.id;
  this.speed = 100;


  this.anchor.setTo(0.5);
  game.physics.enable(this);
  game.add.existing(this);

  this.cursors = game.input.keyboard.createCursorKeys();
  this.body.width = 20;
  this.body.offset.x = 22;
  this.body.height = 20;
  this.body.offset.y = 44;
  this.animations.add("goLeft", [9,10,11,12,13,14,15,16,17], 10);
  this.animations.add("goRight", [27,28,29,30,31,32,33,34,35], 10);
  this.animations.add("goUp", [0,1,2,3,4,5,6,7,8], 10);
  this.animations.add("goDown", [18,19,20,21,22,23,24,25,26], 10);


  this.isFighting = false;
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
    this.frame = 19;
    this.animations.stop();
  }
};


Player.prototype.emitData = function(handler){
  if (!this.isFighting) {
    handler.socket.emit("playerData", {
      x : this.x,
      y : this.y,
      id : handler.playerID,
      frame : this.frame
    })
  }
}
