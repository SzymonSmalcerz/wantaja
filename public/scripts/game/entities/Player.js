let Player = function(game,data) {

  Phaser.Sprite.call(this,game,data.x,data.y,"player");

  this.skillsDictionary = data.skillsDictionary || [{
    skillName : "punch",
    onPlayer : false
  },{
    skillName : "poison",
    onPlayer : false
  },{
    skillName : "ignite",
    onPlayer : false
  },{
    skillName : "entangle",
    onPlayer : false
  },{
    skillName : "health",
    onPlayer : true
  }];
  this.health = data.health || 10;
  this.maxHealth = data.maxHealth || 19;
  this.mana = data.mana || 10;
  this.maxMana = data.maxMana || 19;
  this.experience = data.experience || 10;
  this.requiredExperience = data.requiredExperience || 10;

  this.strength = data.strength || 1;
  this.agility = data.agility || 1;
  this.vitality = data.vitality || 1;
  this.intelligence = data.intelligence || 1;

  this.attack = data.attack || 1;
  this.dodge = data.dodge || 0;
  this.level = data.level || 1;
  this.id = data.id || 10;
  this.leftStatusPoints = data.leftStatusPoints || 0;
  this.speed = 100;
  this.realSpeed = this.speed/game.time.desiredFps;

  this.frame = 25;
  this.previousFrame = 25;

  this.anchor.setTo(0.5);
  game.physics.enable(this);
  this.body.collideWorldBounds = true;
  game.add.existing(this);

  this.body.width = 20;
  this.body.offset.x = 22;
  this.body.height = 20;
  this.body.offset.y = 44;
  let howManyAnimationsPerSec = 12;
  this.animations.add("goLeft", [9,10,11,12,13,14,15,16,17], howManyAnimationsPerSec);
  this.animations.add("goRight", [27,28,29,30,31,32,33,34,35], howManyAnimationsPerSec);
  this.animations.add("goUp", [0,1,2,3,4,5,6,7,8], howManyAnimationsPerSec);
  this.animations.add("goDown", [18,19,20,21,22,23,24,25,26], howManyAnimationsPerSec);


  this.canMove = true;
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
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
        console.log(key + " -> " + data[key]);
        this[key] = data[key];
    }
  }
};

Player.prototype.blockMovement = function() {
  this.canMove = false;
}

Player.prototype.unblockMovement = function() {
  this.canMove = true;
}

Player.prototype.setFightingMode = function() {
  this.isFighting = true;
  this.frame = 1;
  this.mana = this.maxMana;
  this.health = this.maxHealth;
  this.blockMovement();
}

Player.prototype.quitFightingMode = function() {
  this.isFighting = false;
  this.unblockMovement();
}

Player.prototype.emitData = function(handler){
  if (this.canMove && (this.previousPosition.x != this.x || this.previousPosition.y != this.y || this.previousFrame != this.frame)) {
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
