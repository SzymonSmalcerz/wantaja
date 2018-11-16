let FlexibleTitledButton = function(state,x,y,title,style,fixedToCamera = false) {
  Phaser.Group.call(this,state.game);

  this.state = state;

  this.uiGroupTile_normal = state.add.tileSprite(0,0,0,80,"flexibleButtonNorm");
  this.uiGroupTile_left = state.add.sprite(0,0,"flexibleButtonLeft");
  this.uiGroupTile_right = state.add.sprite(0,0,"flexibleButtonRight");

  this.uiGroupTile_normal.inputEnabled = true;
  this.uiGroupTile_left.inputEnabled = true;
  this.uiGroupTile_right.inputEnabled = true;

  this.buttons = [];
  this.buttons.push(this.uiGroupTile_normal);
  this.buttons.push(this.uiGroupTile_left);
  this.buttons.push(this.uiGroupTile_right);

  this.fixedToCamera = fixedToCamera;
  this.anchor = {};
  let self = this;
  // this.anchor.setTo = function(x,y) {
  //   y = y || ( y === 0 ? y : x);
  //   self.button.anchor.setTo(x,y);
  //   self.title.reset(Math.round(self.uiGroupTile_normal.x + (0.5-x) * self.uiGroupTile_normal.width),Math.round(self.uiGroupTile_normal.y + (0.5-y) * self.button.height));
  // }

  this.buttons.forEach(buttonPart => {
    this.add(buttonPart);
  });

  this.addBasicEvents();

  this.title = state.add.text(x,y);
  this.title.smoothed = false;
  // this.title.anchor.setTo(0.5);
  this.title.text = title;

  this.disabled = false;

  if(style) {
    this.title.fontSize = style.fontSize ? style.fontSize : this.title.fontSize;
  }
  handler.styleText(this.title);

  this.add(this.title);
};


FlexibleTitledButton.prototype = Object.create(Phaser.Group.prototype);
FlexibleTitledButton.prototype.constructor = FlexibleTitledButton;

FlexibleTitledButton.prototype.addBasicEvents = function() {

  this.buttons.forEach(buttonPart => {
    buttonPart.events.onInputOver.add(function() {
      this.state.game.canvas.style.cursor = "pointer";
    }, this);

    buttonPart.events.onInputOut.add(function() {
      this.state.game.canvas.style.cursor = "default";
    }, this);
  });

  this.addOnInputOverFunction(function() {
    if(!this.disabled) {
      this.setOverFrame();
    }
  }, this);
  this.addOnInputDownFunction(function() {
    if(!this.disabled) {
      this.setDownFrame();
    }
  }, this);
  this.addOnInputUpFunction(function() {
    if(!this.disabled) {
      this.setNormalFrame();
    }
  }, this);
  this.addOnInputOutFunction(function() {
    if(!this.disabled) {
      this.setNormalFrame();
    }
  }, this);
};

FlexibleTitledButton.prototype.reset = function(x,y) {
  this.resize(x,y);
  this.title.reset(Math.round(this.uiGroupTile_normal.x + this.uiGroupTile_normal.width/2 - this.title.width/2),Math.round(this.uiGroupTile_normal.y + this.uiGroupTile_normal.height/2 - this.title.height/2));
};

FlexibleTitledButton.prototype.resize = function(x,y) {
  this.uiGroupTile_left.reset(x,y);
  this.uiGroupTile_normal.reset(x + this.uiGroupTile_left.width,y);
  this.uiGroupTile_normal.width = this.title.width + 20;
  this.uiGroupTile_normal.height = 80;
  this.uiGroupTile_right.reset(x + this.uiGroupTile_left.width + this.uiGroupTile_normal.width,y);
};

FlexibleTitledButton.prototype.getWidth = function() {
  return this.uiGroupTile_left.width + this.uiGroupTile_normal.width + this.uiGroupTile_right.width;
};

FlexibleTitledButton.prototype.removeAllEvents = function() {
  this.buttons.forEach(buttonPart => {
    buttonPart.events.onInputOver.removeAll();
    buttonPart.events.onInputUp.removeAll();
    buttonPart.events.onInputDown.removeAll();
    buttonPart.events.onInputOut.removeAll();
  });

  this.addBasicEvents();
};

FlexibleTitledButton.prototype.changeTitle = function(text) {
  this.title.text = text;
  this.resize(this.uiGroupTile_left.position.x, this.uiGroupTile_left.position.y);
};

FlexibleTitledButton.prototype.setNormalFrame = function() {
  this.uiGroupTile_left.frame = 0;
  this.uiGroupTile_normal.frame = 0;
  this.uiGroupTile_right.frame = 0;
};

FlexibleTitledButton.prototype.setOverFrame = function() {
  this.uiGroupTile_left.frame = 2;
  this.uiGroupTile_normal.frame = 2;
  this.uiGroupTile_right.frame = 2;
};

FlexibleTitledButton.prototype.setDownFrame = function() {
  this.uiGroupTile_left.frame = 1;
  this.uiGroupTile_normal.frame = 1;
  this.uiGroupTile_right.frame = 1;
};

FlexibleTitledButton.prototype.setDisabledFrame = function() {
  this.uiGroupTile_left.frame = 3;
  this.uiGroupTile_normal.frame = 3;
  this.uiGroupTile_right.frame = 3;
};

FlexibleTitledButton.prototype.addOnInputOverFunction = function(specificFunction,context,addOnce) {
  if(addOnce) {
    this.buttons.forEach(buttonPart => {
      buttonPart.events.onInputOver.addOnce(specificFunction,context || this);
    })
  } else {
    this.buttons.forEach(buttonPart => {
      buttonPart.events.onInputOver.add(specificFunction,context || this);
    })
  };
};

FlexibleTitledButton.prototype.addOnInputOutFunction = function(specificFunction,context,addOnce) {
  if(addOnce) {
    this.buttons.forEach(buttonPart => {
      buttonPart.events.onInputOut.addOnce(specificFunction,context || this);
    })
  } else {
    this.buttons.forEach(buttonPart => {
      buttonPart.events.onInputOut.add(specificFunction,context || this);
    })
  };
};

FlexibleTitledButton.prototype.addOnInputDownFunction = function(specificFunction,context,addOnce) {
  if(addOnce) {
    this.buttons.forEach(buttonPart => {
      buttonPart.events.onInputDown.addOnce(specificFunction,context || this);
    })
  } else {
    this.buttons.forEach(buttonPart => {
      buttonPart.events.onInputDown.add(specificFunction,context || this);
    })
  };
};

FlexibleTitledButton.prototype.addOnInputUpFunction = function(specificFunction,context,addOnce) {
  if(addOnce) {
    this.buttons.forEach(buttonPart => {
      buttonPart.events.onInputUp.addOnce(specificFunction,context || this);
    })
  } else {
    this.buttons.forEach(buttonPart => {
      buttonPart.events.onInputUp.add(specificFunction,context || this);
    })
  };
};

FlexibleTitledButton.prototype.disableButton = function() {
  this.setDisabledFrame();
  this.disabled = true;
};

FlexibleTitledButton.prototype.enableButton = function() {
  this.disabled = false;
};
