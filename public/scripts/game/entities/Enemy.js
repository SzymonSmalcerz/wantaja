
let Enemy = function(state,data) {
  Button.call(this,state,data.x,data.y,data.key || "spider",0,0,1);
  this.anchor.setTo(0.5);
  state.game.physics.enable(this);
  this.id = data.id;
  this.level = data.level;
  this.health = data.health;
  this.maxHealth = data.maxHealth;
  this.inputEnabled = true;
  this.state = state;
  // this.input.pixelPerfectOver = true;
  this.animated = data.animated || false;
  if(this.animated) {
    this.howManyAnimationsPerSec = this.animated.pop();
    this.animations.add("normalState", this.animated, this.howManyAnimationsPerSec, true);
    this.animations.add("hoverState", this.animated.map(val => val + this.animated.length), this.howManyAnimationsPerSec, true);
    this.events.destroy();
    this.addOnInputOverFunction(function() {
      if(!this.disabled) {
        this.animations.play("hoverState");
      };
    },this);
    this.addOnInputOutFunction(function() {
      if(!this.disabled) {
        this.animations.play("normalState");
      };
    },this);
    this.addOnInputDownFunction(function() {
      if(!this.disabled) {
        this.animations.play("hoverState");
      };
    },this);
    this.addOnInputUpFunction(function() {
      if(!this.disabled) {
        this.animations.play("normalState");
      };
    },this);
    this.animations.play("normalState");
  }

  this.addOnInputDownFunction(function() {
    this.state.playerMoveManager.eraseXses();
  }, this);


  this.events.onInputOver.add(function() {
    this.state.game.canvas.style.cursor = "url('assets/shortestPath/xSword.png'), auto";
  }, this);

  this.events.onInputOut.add(function() {
    this.state.game.canvas.style.cursor = "default";
  }, this);

  this.events.onInputUp.add(function() {
    this.state.game.canvas.style.cursor = "default";
  }, this);
}


Enemy.prototype = Object.create(Button.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.reset = function(x,y,key) {
  Button.prototype.reset.call(this,x,y,key);
}

Enemy.prototype.kill = function() {
  Button.prototype.kill.call(this);
}
