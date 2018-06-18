
let OtherPlayer = function(game,x,y, id){
  Phaser.Sprite.call(this,game,x,y,"character");


  game.add.existing(this);
  this.anchor.setTo(0.5);
  game.physics.enable(this);
  this.speed = 150;
  this.id = id;

  this.animations.add("goLeft", [9,10,11,12,13,14,15,16,17], 10);
  this.animations.add("goRight", [27,28,29,30,31,32,33,34,35], 10);
  this.animations.add("goUp", [0,1,2,3,4,5,6,7,8], 10);
  this.animations.add("goDown", [18,19,20,21,22,23,24,25,26], 10);
}

OtherPlayer.prototype = Object.create(Phaser.Sprite.prototype);
OtherPlayer.prototype.constructor = OtherPlayer;


OtherPlayer.prototype.goLeft = function() {
    this.animations.play("goLeft");
};

OtherPlayer.prototype.goRight = function() {
    this.animations.play("goRight");
};

OtherPlayer.prototype.goDown = function() {
    this.animations.play("goDown");
};

OtherPlayer.prototype.goUp = function() {
    this.animations.play("goUp");
};
