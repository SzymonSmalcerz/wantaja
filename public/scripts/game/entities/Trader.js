
let Trader = function(state, data) {
  Button.call(this,state,data.x,data.y,data.key || 'Trader',0,0,1,false,false);
  this.anchor.setTo(0.5);
  state.game.physics.enable(this);
  this.id = data.id;
  this.inputEnabled = true;
  this.items = data.items;

  this.addOnInputDownFunction(function() {
    if(getDistanceBetweenEntityAndPlayer(this, this.state.player) <= 50) {
      this.state.blockPlayerMovement();
      this.state.uiManager.showTradeWindow(this);
    } else {
      this.state.playerMoveManager.eraseXses();
    }
  }, this);
}


Trader.prototype = Object.create(Button.prototype);
Trader.prototype.constructor = Trader;


Trader.prototype.reset = function(x,y,key) {
  Button.prototype.reset.call(this,x,y,key);
}

Trader.prototype.kill = function() {
  Button.prototype.kill.call(this);
}
