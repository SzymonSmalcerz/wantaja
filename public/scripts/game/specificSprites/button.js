let Button = function(game,x,y,key,normalFrame,downFrame,overFrame,disabledFrame,fixedToCamera = true) {
  Phaser.Sprite.call(this,game,x,y,key);

  game.add.existing(this);
  this.anchor.setTo(0.5);
  // this.fixedToCamera = fixedToCamera;
  this.inputEnabled = true;

  this.normalFrame = normalFrame || 0;
  this.overFrame = downFrame || this.downFrame;
  this.overFrame = overFrame || this.normalFrame;
  this.disabledFrame = disabledFrame || this.normalFrame;

  this.disabled = false;

  this.initializeFrames();
};

Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;

Button.prototype.setNormalFrame = function(){
  this.frame = this.normalFrame;
};

Button.prototype.setOverFrame = function(){
  this.frame = this.overFrame;
};

Button.prototype.setDisabledFrame = function(){
  this.frame = this.disabledFrame;
};

Button.prototype.disableButton = function(){
  this.disabled = true;
  this.setDisabledFrame();
}

Button.prototype.addOnInputOverFunction = function(specificFunction,context,addOnce){
  if(addOnce) {
    this.events.onInputOver.addOnce(specificFunction,context || this);
  } else {
    this.events.onInputOver.add(specificFunction,context || this);
  };
};

Button.prototype.addOnInputOutFunction = function(specificFunction,context,addOnce){
  if(addOnce) {
    this.events.onInputOut.addOnce(specificFunction,context || this);
  } else {
    this.events.onInputOut.add(specificFunction,context || this);
  };
};

Button.prototype.addOnInputDownFunction = function(specificFunction,context,addOnce){
  if(addOnce) {
    this.events.onInputDown.addOnce(specificFunction,context || this);
  } else {
    this.events.onInputDown.add(specificFunction,context || this);
  };
};

Button.prototype.addOnInputUpFunction = function(specificFunction,context,addOnce){
  if(addOnce) {
    this.events.onInputUp.addOnce(specificFunction,context || this);
  } else {
    this.events.onInputUp.add(specificFunction,context || this);
  };
};

Button.prototype.disableButton = function(){
  this.inputEnabled = false;
  this.frame = this.disabledFrame;
};

Button.prototype.enableButton = function(){
  this.inputEnabled = true;
  this.frame = this.normalFrame;
};

Button.prototype.initializeFrames = function(){
  this.addOnInputOverFunction(function(){
    if(!this.disabled){
      this.frame = this.overFrame;
    };
  },this);
  this.addOnInputOutFunction(function(){
    if(!this.disabled){
      this.frame = this.normalFrame;
    };
  },this);
  this.addOnInputDownFunction(function(){
    if(!this.disabled){
      this.frame = this.downFrame;
    };
  },this);
  this.addOnInputUpFunction(function(){
    if(!this.disabled){
      this.frame = this.normalFrame;
    };
  },this);
};
