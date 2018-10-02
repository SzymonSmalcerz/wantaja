
let Npc = function(state, data) {
  Button.call(this,state,data.x,data.y,data.key,0,0,1);
  this.anchor.setTo(0.5);
  state.game.physics.enable(this);
  this.id = data.id;
  this.inputEnabled = true;

  this.addOnInputDownFunction(function() {
    if(getDistanceBetweenEntityAndPlayer(this, this.state.player) <= 50) {
      this.state.blockPlayerMovement();
    } else {
      this.state.playerMoveManager.eraseXses();
    }
  }, this);
}


Npc.prototype = Object.create(Button.prototype);
Npc.prototype.constructor = Npc;


Npc.prototype.reset = function(x,y,key) {
  Button.prototype.reset.call(this,x,y,key);
}

Npc.prototype.kill = function() {
  Button.prototype.kill.call(this);
}
