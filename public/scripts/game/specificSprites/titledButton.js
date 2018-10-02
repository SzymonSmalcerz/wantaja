let TitledButton = function(state,x,y,key,normalFrame,downFrame,overFrame,disabledFrame,title,style,fixedToCamera = true) {
  Phaser.Group.call(this,state.game);
  this.button = new Button(state,x,y,key,normalFrame,downFrame,overFrame,disabledFrame,fixedToCamera);
  this.title = state.add.text(x,y);
  this.title.smoothed = false;
  this.title.anchor.setTo(0.5);
  this.title.text = title;
  if(style) {
    this.title.fontSize = style.fontSize ? style.fontSize : this.title.fontSize;
  }
  handler.styleText(this.title);
  this.fixedToCamera = fixedToCamera;
  this.anchor = {};
  let self = this;
  this.anchor.setTo = function(x,y) {
    y = y || ( y === 0 ? y : x);
    self.button.anchor.setTo(x,y);
    self.title.reset(Math.round(self.button.x + (0.5-x) * self.button.width),Math.round(self.button.y + (0.5-y) * self.button.height));
  }

  this.add(this.button);
  this.add(this.title);
};

TitledButton.prototype = Object.create(Phaser.Group.prototype);
TitledButton.prototype.constructor = TitledButton;

TitledButton.prototype.reset = function(x,y,key){
  this.button.reset(x,y,key);
  this.title.reset(Math.round(this.button.x + (0.5-this.button.anchor.x) * this.button.width),Math.round(this.button.y + (0.5-this.button.anchor.y) * this.button.height));
};

TitledButton.prototype.setNormalFrame = function(){
  this.button.setNormalFrame();
};

TitledButton.prototype.setOverFrame = function(){
  this.button.setOverFrame();
};

TitledButton.prototype.setDisabledFrame = function(){
  this.button.setDisabledFrame();
};

TitledButton.prototype.addOnInputOverFunction = function(specificFunction,context,addOnce){
  this.button.addOnInputOverFunction(specificFunction,context,addOnce);
};

TitledButton.prototype.addOnInputOutFunction = function(specificFunction,context,addOnce){
  this.button.addOnInputOutFunction(specificFunction,context,addOnce);
};

TitledButton.prototype.addOnInputDownFunction = function(specificFunction,context,addOnce){
  this.button.addOnInputDownFunction(specificFunction,context,addOnce);
};

TitledButton.prototype.addOnInputUpFunction = function(specificFunction,context,addOnce){
  this.button.addOnInputUpFunction(specificFunction,context,addOnce);
};

TitledButton.prototype.disableButton = function(){
  this.button.disableButton();
};

TitledButton.prototype.enableButton = function(){
  this.button.disableButton();
};
