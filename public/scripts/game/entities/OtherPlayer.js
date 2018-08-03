
let OtherPlayer = function(game,x,y, id){
  Phaser.Sprite.call(this,game,x,y,"player");
  game.add.existing(this);
  this.anchor.setTo(0.5);
  game.physics.enable(this);
  this.id = id;
  this.smoothed = false;
}

OtherPlayer.prototype = Object.create(Phaser.Sprite.prototype);
OtherPlayer.prototype.constructor = OtherPlayer;
