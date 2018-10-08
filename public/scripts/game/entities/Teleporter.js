
let Teleporter = function(state, data) {
  Button.call(this,state,data.x,data.y,data.key,0,0,1,false,false);
  this.anchor.setTo(0.5);
  state.game.physics.enable(this);
  this.id = data.id;
  this.inputEnabled = true;
  this.teleports = data.teleports;

  this.addOnInputDownFunction(function() {
    if(getDistanceBetweenEntityAndPlayer(this, this.state.player) <= 50) {
      this.state.blockPlayerMovement();
      this.state.uiManager.showTeleportWindow(this);
    } else {
      this.state.playerMoveManager.eraseXses();
    }
  }, this);
}


Teleporter.prototype = Object.create(Button.prototype);
Teleporter.prototype.constructor = Teleporter;


Teleporter.prototype.reset = function(x,y,key) {
  Button.prototype.reset.call(this,x,y,key);
}

Teleporter.prototype.kill = function() {
  Button.prototype.kill.call(this);
}
