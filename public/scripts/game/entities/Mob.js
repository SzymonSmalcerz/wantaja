let Mob = function(state,data) {
  this.leftBorder = data.x;
  this.rightBorder = data.x + data.width;
  this.upperBorder = data.y;
  this.bottomBorder = data.y + data.height;
  let x = Math.random() * data.width + data.x;
  let y = Math.random() * data.height + data.y;
  Phaser.Sprite.call(this,state.game,x,y,data.key);
  this.state = state;
  this.speed = 2;
  this.anchor.setTo(0.5);
  this.chanceOfDoingSpecialAction = data.chanceOfDoingSpecialAction || 0.55;
  this.changeTime = data.changeTime || 5000;
  this.state.game.add.existing(this);
  this.howManyAnimationsPerSec = data.howManyAnimationsPerSec || 10;
  this.actions = ["goLeft","goRight","goUp","goDown","specialAction"];
  this.currentAction = "goLeft";
  this.animations.add("goLeft", [0,1,2,3], this.howManyAnimationsPerSec);
  this.animations.add("goRight", [4,5,6,7], this.howManyAnimationsPerSec);
  this.animations.add("goUp", [8,9,10,11], this.howManyAnimationsPerSec);
  this.animations.add("goDown", [12,13,14,15], this.howManyAnimationsPerSec);
  this.animations.add("specialAction", [16,17,18,19], this.howManyAnimationsPerSec);
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
  this.state.changeRenderOrder(this);
};

Mob.prototype.goDown = function() {
  if(!(this.y < this.bottomBorder)){
    this.currentAction = "specialAction";
    return;
  }
  this.y += this.speed;
  this.animations.play("goDown");
  this.state.changeRenderOrder(this);
};

Mob.prototype.goRight = function() {
  if(!(this.x < this.rightBorder)){
    this.currentAction = "specialAction";
    return;
  }
  this.x += this.speed;
  this.animations.play("goRight");
  // this.state.changeRenderOrder(this);
};

Mob.prototype.goLeft = function() {
  if(!(this.x > this.leftBorder)){
    this.currentAction = "specialAction";
    return;
  }
  this.x -= this.speed;
  this.animations.play("goLeft");
  // this.state.changeRenderOrder(this);
};

Mob.prototype.specialAction = function() {
  this.animations.play("specialAction");
};

Mob.prototype.update = function() {
  this[this.currentAction]();
};

Mob.prototype.changeAction = function() {

  let self = this;
  if(Math.random() > this.chanceOfDoingSpecialAction) {
    this.currentState = "specialAction";
  } else {
    let randomIndex = Math.floor(Math.random() * this.actions.length);
    this.currentAction = this.actions[randomIndex];
  }
  setTimeout(function() {
    self.changeAction();
  },Math.random() * self.changeTime/2 + 2 * self.changeTime/3);
};
