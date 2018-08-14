
let Enemy = function(state,data) {
  Button.call(this,state.game,data.x,data.y,data.key || "spider",0,0,1);
  this.anchor.setTo(0.5);
  state.game.physics.enable(this);
  this.id = data.id;
  this.lvl = data.lvl;
  this.health = data.health;
  this.maxHealth = data.maxHealth;
  this.inputEnabled = true;
  // this.input.pixelPerfectOver = true;
  this.animated = data.animated || false;
  if(this.animated) {
    this.howManyAnimationsPerSec = 10;
    this.animations.add("normalState", [0,1,2,3], this.howManyAnimationsPerSec, true);
    this.animations.add("hoverState", [4,5,6,7], this.howManyAnimationsPerSec, true);
    this.events.destroy();
    this.addOnInputOverFunction(function(){
      if(!this.disabled){
        this.animations.play("hoverState");
      };
    },this);
    this.addOnInputOutFunction(function(){
      if(!this.disabled){
        this.animations.play("normalState");
      };
    },this);
    this.addOnInputDownFunction(function(){
      if(!this.disabled){
        this.animations.play("hoverState");
      };
    },this);
    this.addOnInputUpFunction(function(){
      if(!this.disabled){
        this.animations.play("normalState");
      };
    },this);
    this.animations.play("normalState");
  }
}


Enemy.prototype = Object.create(Button.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.reset = function(x,y,key) {
  Button.prototype.reset.call(this,x,y,key);
}

Enemy.prototype.kill = function() {
  Button.prototype.kill.call(this);
}
