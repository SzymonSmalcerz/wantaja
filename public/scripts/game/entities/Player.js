console.log("XD");

let Player = function(game,data){

  Phaser.Sprite.call(this,game,data.x,data.y,"player");


  this.health = data.health || 10;
  this.maxHealth = data.maxHealth || 19;
  this.experience = data.experience || 10;
  this.requiredExperience = data.requiredExperience || 10;
  this.level = data.level || 10;
  this.id = data.id || 10;
  this.speed = 100;
  this.realSpeed = 100/game.time.desiredFps;

  this.frame = 25;
  this.previousFrame = 25;

  this.anchor.setTo(0.5);
  game.physics.enable(this);
  game.add.existing(this);

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



Player.prototype.goUp = function(){
  this.body.velocity.setTo(0);
  this.body.velocity.y = -this.speed;
  this.animations.play("goUp");
};

Player.prototype.goDown = function(){
  this.body.velocity.setTo(0);
  this.body.velocity.y = this.speed;
  this.animations.play("goDown");
};

Player.prototype.goRight = function(){
  this.body.velocity.setTo(0);
  this.body.velocity.x = this.speed;
  this.animations.play("goRight");
};

Player.prototype.goLeft = function(){
  this.body.velocity.setTo(0);
  this.body.velocity.x = -this.speed;
  this.animations.play("goLeft");
};

Player.prototype.updateData = function(data) {
  this.experience = data.experience;
  this.health = data.health;
  this.level = data.level;

};

Player.prototype.emitData = function(handler){
  if (!this.isFighting && (this.previousPosition.x != this.x || this.previousPosition.y != this.y || this.previousFrame != this.frame)) {
    handler.socket.emit("playerData", {
      x : this.x,
      y : this.y,
      id : handler.playerID,
      frame : this.frame
    });
  };

  this.previousFrame = this.frame;
};

Player.prototype.damage = function(way) {
  if(way == "punch"){
    console.log("punching");
  };
}
