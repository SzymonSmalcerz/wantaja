let Mob = function(state,data) {
  this.leftBorder = data.x;
  this.rightBorder = data.x + data.width;
  this.upperBorder = data.y;
  this.bottomBorder = data.y + data.height;
  let x = Math.floor(Math.random() * data.width + data.x);
  let y = Math.floor(Math.random() * data.height + data.y);
  Phaser.Sprite.call(this,state.game,x,y,data.key);
  this.state = state;
  this.speed = 1;
  this.anchor.setTo(0.5);
  this.specialTime = data.specialTime;

  this.chanceOfDoingSpecialAction = data.chanceOfDoingSpecialAction || 0.55;
  this.changeTime = data.changeTime || 5000;
  this.state.game.add.existing(this);
  this.howManyAnimationsPerSec = data.howManyAnimationsPerSec || 10;
  this.actions = ["goLeft","goRight","goUp","goDown","specialAction"];
  this.currentAction = "goLeft";
  if(data.specialActionArray) {
    data.specialActionArray = data.specialActionArray.toString().split(",").map(value => Number(value));
  }

  if(data.goLeft) { data.goLeft = data.goLeft.toString().split(",").map(value => Number(value));}
  if(data.goRight) { data.goRight = data.goRight.toString().split(",").map(value => Number(value));}
  if(data.goUp) { data.goUp = data.goUp.toString().split(",").map(value => Number(value));}
  if(data.goDown) { data.goDown = data.goDown.toString().split(",").map(value => Number(value));}
  
  this.specialActionArray = data.specialActionArray || [16,17,18,19];
  this.animations.add("goLeft", data.goLeft || [0,1,2,3], this.howManyAnimationsPerSec);
  this.animations.add("goRight", data.goRight || [4,5,6,7], this.howManyAnimationsPerSec);
  this.animations.add("goUp", data.goUp || [8,9,10,11], this.howManyAnimationsPerSec);
  this.animations.add("goDown", data.goDown || [12,13,14,15], this.howManyAnimationsPerSec);
  this.animations.add("specialAction", this.specialActionArray, this.howManyAnimationsPerSec);
  this.smoothed = false;
  this.changeAction();
}

Mob.prototype = Object.create(Phaser.Sprite.prototype);
Mob.prototype.constructor = Mob;



Mob.prototype.goUp = function() {
  if(!(this.y > this.upperBorder)){
    this.currentAction = "specialAction";
    return;
  }
  this.y -= this.speed;
  this.animations.play("goUp");
};

Mob.prototype.goDown = function() {
  if(!(this.y < this.bottomBorder)){
    this.currentAction = "specialAction";
    return;
  }
  this.y += this.speed;
  this.animations.play("goDown");
};

Mob.prototype.goRight = function() {
  if(!(this.x < this.rightBorder)){
    this.currentAction = "specialAction";
    return;
  }
  this.x += this.speed;
  this.animations.play("goRight");
};

Mob.prototype.goLeft = function() {
  if(!(this.x > this.leftBorder)){
    this.currentAction = "specialAction";
    return;
  }
  this.x -= this.speed;
  this.animations.play("goLeft");
};

Mob.prototype.specialAction = function() {
  this.animations.play("specialAction");
};

Mob.prototype.updateMob = function() {
  this[this.currentAction]();
};

Mob.prototype.changeAction = function() {
  let self = this;
  if(Math.random() < this.chanceOfDoingSpecialAction) {
    this.currentState = "specialAction";
  } else {
    let randomIndex = Math.floor(Math.random() * this.actions.length);
    this.currentAction = this.actions[randomIndex];
  }
  setTimeout(function() {
    self.changeAction();
  },this.currentState == "specialAction" ? ( this.specialTime ? this.specialTime* 2/3 + Math.random() * this.specialTime/2 : Math.random() * self.changeTime/2 + 2 * self.changeTime/3 ) : Math.random() * self.changeTime/2 + 2 * self.changeTime/3);
};
