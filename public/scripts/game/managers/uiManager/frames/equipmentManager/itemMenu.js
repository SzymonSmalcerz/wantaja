let ItemMenu = function(equipmentManager) {
  Phaser.Group.call(this,equipmentManager.state.game);
  this.equipmentManager = equipmentManager;
  this.state = equipmentManager.state;
  this.frame = equipmentManager.state.game.add.sprite(-500, -500, "itemActionBackground");
  this.frame.alpha = 0.9;
  this.frame.anchor.setTo(0.5);
  this.getPositionsCoords();
  this.closeButton = new Button(this.state.game,this.posX + 83, this.posY - 128,"closeButton",0,1,2,3);
  this.frameGroup.add(this.closeButton);
  this.uiManager.blockPlayerMovementsWhenOver(this.closeButton,true);
  this.closeButton.addOnInputDownFunction(function(){
    this.hideWindow();
  },this);


  this.add(this.frame);
  this.visible = false;
};

ItemMenu.prototype = Object.create(Phaser.Group.prototype);
ItemMenu.prototype.constructor = ItemMenu;

getPositionsCoords() {
  this.posX = Math.round(this.state.game.width/2);
  this.posY = Math.round(this.state.game.height/2);
}

ItemMenu.prototype.show = function(item) {
  let x = item.x + this.frame.width/2 - 12;
  let y = item.y + this.frame.height + item.height;
  this.frame.reset(x,y);
  this.visible = true;
}

ItemMenu.prototype.hide = function() {
  this.visible = false;
}
