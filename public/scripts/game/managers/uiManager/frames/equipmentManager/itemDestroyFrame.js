let ItemDiscardFrame = function(equipmentManager, x, y) {
  Phaser.Group.call(this,equipmentManager.state.game);

  this.currentItem = null;
  this.x = x;
  this.y = y;
  this.equipmentManager = equipmentManager;
  this.state = equipmentManager.state;

  this.frame = equipmentManager.state.game.add.sprite(0, 0, "itemDiscardFrame");
  this.frame.anchor.setTo(0.5);
  this.add(this.frame);


  this.title = equipmentManager.state.add.text(0,-65);
  this.title.smoothed = false;
  handler.styleText(this.title);
  this.title.anchor.setTo(0.5,0);
  this.add(this.title);

  this.info = equipmentManager.state.add.text(0,0);
  this.info.smoothed = false;
  this.info.text = 'item will be destroyed !';
  handler.styleText(this.info);
  this.info.fontSize = 16;
  this.info.fill = '#F22';;
  this.info.anchor.setTo(0.5,0);
  this.add(this.info);

  this.yesButton = new Button(this.state.game,-52, 50,"yesButton",0,1,2,3);
  this.yesButton.anchor.setTo(0.5);
  this.add(this.yesButton);
  this.yesButton.addOnInputUpFunction(function() {
    this.equipmentManager.emitDiscardItemSignal(this.currentItem);
    this.hide();
  }, this);

  this.noButton = new Button(this.state.game,52, 50,"noButton",0,1,2,3);
  this.noButton.anchor.setTo(0.5);
  this.add(this.noButton);
  this.noButton.addOnInputUpFunction(function() {
    this.hide();
  }, this);

  this.equipmentManager.uiManager.blockPlayerMovementsWhenOver(this.noButton,true);
  this.equipmentManager.uiManager.blockPlayerMovementsWhenOver(this.yesButton,true);
  this.equipmentManager.uiManager.blockPlayerMovementsWhenOver(this.frame,true);

  this.visible = false;
};

ItemDiscardFrame.prototype = Object.create(Phaser.Group.prototype);
ItemDiscardFrame.prototype.constructor = ItemDiscardFrame;

ItemDiscardFrame.prototype.reset = function(x,y) {
  this.x = x;
  this.y = y;
}

ItemDiscardFrame.prototype.show = function(item) {

  this.currentItem = item;
  this.title.text = `Do you really want\nto discard ${item.key} ?`;
  this.title.fontSize = 22;
  // while(this.title.width > 110) {
  //   this.title.fontSize -= 1;
  // }

  this.visible = true;
}

ItemDiscardFrame.prototype.hide = function() {
  this.visible = false;
}
