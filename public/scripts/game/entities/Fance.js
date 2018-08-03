
let Fence = function(state,x,y,width,height,type,key) {
  this.state = state;
  state.fanceGroup = state.fanceGroup || state.add.group();
  // this.anchor.setTo(0.5);
  // game.physics.enable(this);
  // this.smoothed = false;
}


Fence.prototype = Object.create(Phaser.Sprite.prototype);
Fence.prototype.constructor = Fence;
