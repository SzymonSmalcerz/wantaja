
let OtherPlayer = function(game,data){
  Phaser.Sprite.call(this,game,data.x,data.y,data.key || "player");
  game.add.existing(this);
  this.anchor.setTo(0.5);
  game.physics.enable(this);
  this.id = data.id;
  this.nick = data.nick;
  this.lvl = data.lvl;
  this.smoothed = false;
}

OtherPlayer.prototype = Object.create(Phaser.Sprite.prototype);
OtherPlayer.prototype.constructor = OtherPlayer;
