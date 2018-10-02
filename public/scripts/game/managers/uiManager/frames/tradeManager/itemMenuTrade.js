let ItemMenuTrade = function(tradeManager, x, y) {
  Phaser.Group.call(this,tradeManager.state.game);

  this.currentItem = null;

  this.x = x;
  this.y = y;
  this.tradeManager = tradeManager;
  this.state = tradeManager.state;

  this.frame = tradeManager.state.game.add.sprite(0, 0, "itemActionBackground");
  // this.frame.alpha = 0.9;
  this.frame.anchor.setTo(0.5);
  this.add(this.frame);


  this.title = tradeManager.state.add.text(-20,-115);
  this.title.smoothed = false;
  handler.styleText(this.title);
  this.title.anchor.setTo(0.5,0);
  this.add(this.title);

  this.bonuses = tradeManager.state.add.text(0,-60);
  this.bonuses.smoothed = false;
  handler.styleText(this.bonuses);
  this.bonuses.anchor.setTo(0.5,0);
  this.bonuses.fontSize = 18;
  this.bonuses.text = "bonuses:"
  this.add(this.bonuses);

  this.description = tradeManager.state.add.text(-70,-40);
  this.description.smoothed = false;
  handler.styleText(this.description);
  this.description.anchor.setTo(0,0);
  this.description.fontSize = 17;
  this.add(this.description);

  this.priceText = tradeManager.state.add.text(0,-80);
  this.priceText.smoothed = false;
  handler.styleText(this.priceText);
  this.priceText.anchor.setTo(0.5,0);
  this.priceText.fontSize = 17;
  this.add(this.priceText);

  this.closeButton = new Button(this.state,75, -117,"closeButton",0,1,2,3);
  this.add(this.closeButton);

  this.buyButton = new Button(this.state,-45, 94,"buyButton",0,1,2,3);
  this.buyButton.anchor.setTo(0.5);
  this.add(this.buyButton);
  this.buyButton.addOnInputUpFunction(function() {
    this.tradeManager.emitBuyItemSignal(this.currentItem);
    this.hide();
  }, this);

  this.tradeManager.uiManager.blockPlayerMovementsWhenOver(this.closeButton,true);
  this.tradeManager.uiManager.blockPlayerMovementsWhenOver(this.buyButton,true);
  this.tradeManager.uiManager.blockPlayerMovementsWhenOver(this.frame,true);

  this.closeButton.addOnInputDownFunction(function(){
    this.hide();
  },this);

  this.visible = false;
};

ItemMenuTrade.prototype = Object.create(Phaser.Group.prototype);
ItemMenuTrade.prototype.constructor = ItemMenuTrade;

ItemMenuTrade.prototype.reset = function(x,y) {
  this.x = x;
  this.y = y;
}

ItemMenuTrade.prototype.show = function(item) {

  this.currentItem = item;
  this.title.text = item.key;
  this.title.fontSize = 100;
  while(this.title.width > 110 && this.title.height > 30) {
    this.title.fontSize -= 1;
  }

  this.priceText.text = `price: ${item.price}\n`;

  this.description.text = '';
  this.description.text += item.strength ? 'strength: ' + item.strength + '\n' : '';
  this.description.text += item.vitality ? 'vitality: ' + item.vitality + '\n' : '';
  this.description.text += item.intelligence ? 'intelligence: ' + item.intelligence + '\n' : '';
  this.description.text += item.agility ? 'agility: ' + item.agility + '\n' : '';
  this.description.text += item.defence ? `defence: ${item.defence}\n` : '';
  this.description.text += item.minAttack ? `attack: ${item.minAttack} - ${item.maxAttack}\n` : '';

  this.visible = true;
}

ItemMenuTrade.prototype.hide = function() {
  this.visible = false;
}
