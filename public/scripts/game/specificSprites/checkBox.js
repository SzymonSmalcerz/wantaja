let CheckBox = function(game,x,y,checked,
                        unselectedNormalFrame,unselectedDownFrame,unselectedOverFrame,unselectedDisabledFrame,
                        selectedNormalFrame,selectedDownFrame,selectedOverFrame,selectedDisabledFrame,
                        fixedToCamera,key) {
  Phaser.Sprite.call(this,game,x,y,key || "checkBox");

  game.add.existing(this);
  this.anchor.setTo(0.5);
  this.fixedToCamera = fixedToCamera || false;
  this.inputEnabled = true;
  // current state of the checkBox (checked or unchecked);
  this.checked = checked || false;

  this.unselectedNormalFrame = unselectedNormalFrame || 0;
  this.unselectedDownFrame = unselectedDownFrame || 0;
  this.unselectedOverFrame = unselectedOverFrame || 0;
  this.unselectedDisabledFrame = unselectedDisabledFrame || 0;

  this.selectedNormalFrame = selectedNormalFrame || 0;
  this.selectedDownFrame = selectedDownFrame || 0;
  this.selectedOverFrame = selectedOverFrame || 0;
  this.selectedDisabledFrame = selectedDisabledFrame || 0;

  if(this.checked) {
    this.frame = this.selectedNormalFrame;
  } else {
    this.frame = this.unselectedNormalFrame;
  }

  this.disabled = false;

  this.smoothed = false;
  this.initializeFrames();
};

CheckBox.prototype = Object.create(Phaser.Sprite.prototype);
CheckBox.prototype.constructor = CheckBox;

CheckBox.prototype.setNormalFrame = function(){
  if(this.checked){
    this.frame = this.selectedNormalFrame;
  } else {
    this.frame = this.unselectedNormalFrame;
  }
};

CheckBox.prototype.reset = function(x,y) {
  Phaser.Sprite.prototype.reset.call(this,x,y);
}

CheckBox.prototype.setOverFrame = function(){
  if(this.checked){
    this.frame = this.selectedOverFrame;
  } else {
    this.frame = this.unselectedOverFrame;
  }
};

CheckBox.prototype.setDisabledFrame = function(){
  if(this.checked){
    this.frame = this.selectedDisabledFrame;
  } else {
    this.frame = this.unselectedDisabledFrame;
  }
};

CheckBox.prototype.setDownFrame = function(){
  if(this.checked){
    this.frame = this.selectedDownFrame;
  } else {
    this.frame = this.unselectedDownFrame;
  }
};

CheckBox.prototype.setDownFrame = function(){
  if(this.checked){
    this.frame = this.selectedDownFrame;
  } else {
    this.frame = this.unselectedDownFrame;
  }
};

CheckBox.prototype.uncheck = function() {
  this.checked = false;
  this.setNormalFrame();
}

CheckBox.prototype.toggleCheck = function(){
  this.checked = !this.checked;
};

CheckBox.prototype.addOnCheckFunction = function(specificFunction,context,addOnce){
  let self = this;
  if(addOnce) {
    this.events.onInputUp.addOnce(function(){
      if(self.checked) {
        specificFunction.call(context || self);
      }
    }, this);
  } else {
    this.events.onInputUp.add(function(){
      if(self.checked) {
        specificFunction.call(context || self);
      }
    }, this);
  };
};

CheckBox.prototype.addOnUncheckFunction = function(specificFunction,context,addOnce){
  let self = this;
  if(addOnce) {
    this.events.onInputUp.addOnce(function(){
      if(!self.checked) {
        specificFunction.call(context || self);
      }
    }, this);
  } else {
    this.events.onInputUp.add(function(){
      if(!self.checked) {
        specificFunction.call(context || self);
      }
    }, this);
  };
};

CheckBox.prototype.disableCheckBox = function(){
  this.inputEnabled = false;
  this.setDisabledFrame();
  this.disabled = true;
};

CheckBox.prototype.enableCheckBox = function(){
  this.inputEnabled = true;
  this.setNormalFrame();
  this.disabled = false;
};


CheckBox.prototype.addOnInputOverFunction = function(specificFunction,context,addOnce){
  if(addOnce) {
    this.events.onInputOver.addOnce(specificFunction,context || this);
  } else {
    this.events.onInputOver.add(specificFunction,context || this);
  };
};

CheckBox.prototype.addOnInputOutFunction = function(specificFunction,context,addOnce){
  if(addOnce) {
    this.events.onInputOut.addOnce(specificFunction,context || this);
  } else {
    this.events.onInputOut.add(specificFunction,context || this);
  };
};

CheckBox.prototype.addOnInputDownFunction = function(specificFunction,context,addOnce){
  if(addOnce) {
    this.events.onInputDown.addOnce(specificFunction,context || this);
  } else {
    this.events.onInputDown.add(specificFunction,context || this);
  };
};

CheckBox.prototype.addOnInputUpFunction = function(specificFunction,context,addOnce){
  if(addOnce) {
    this.events.onInputUp.addOnce(specificFunction,context || this);
  } else {
    this.events.onInputUp.add(specificFunction,context || this);
  };
};

CheckBox.prototype.initializeFrames = function(){
  this.addOnInputOverFunction(function(){
    if(!this.disabled){
      this.setOverFrame();
    };
  },this);
  this.addOnInputOutFunction(function(){
    if(!this.disabled){
      this.setNormalFrame();
    };
  },this);
  this.addOnInputDownFunction(function(){
    if(!this.disabled){
      this.setDownFrame();
      this.toggleCheck();
    };
  },this);
  this.addOnInputUpFunction(function(){
    if(!this.disabled){
      this.setNormalFrame();
    };
  },this);
};
