
let Enemy = function(state,x,y, id,key  = "spider",health,maxHealth,animated) {
  let game = state.game;
  Button.call(this,game,x,y,key,0,0,1);
  this.anchor.setTo(0.5);
  game.physics.enable(this);
  this.id = id;
  this.health = health;
  this.maxHealth = maxHealth;
  this.inputEnabled = true;
  this.input.pixelPerfectOver = true;
  this.descriptionText = state.add.text(x,y - this.height/2);
  this.descriptionText.anchor.setTo(0.5);
  state.styleText(this.descriptionText);
  this.descriptionText.fontSize = 16;
  this.descriptionText.smoothed = false;
  this.descriptionText.text = key + " lvl.1";
  this.animated = animated || false;
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

Enemy.prototype.hideDescription = function() {
  this.descriptionText.visible = false;
}

Enemy.prototype.showDescription = function() {
  this.descriptionText.visible = true;
}

Enemy.prototype.toggleDescription = function() {
  this.descriptionText.visible = !this.descriptionText.visible;
}

Enemy.prototype.reset = function(x,y,key) {
  Button.prototype.reset.call(this,x,y,key);
}

Enemy.prototype.kill = function() {
  this.descriptionText.kill();
  Button.prototype.kill.call(this);
}
