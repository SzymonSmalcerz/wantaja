
let Entity = function(game,data){
  Phaser.Sprite.call(this,game,data.x,data.y,data.name);
  this.anchor.setTo(0,1);
  this.y += this.height;
  game.physics.enable(this);
  this.body.immovable = true;
  this.body.offset.x = parseInt(data["offsetX"]);
  this.body.offset.y = parseInt(data["offsetY"]);
  this.body.width = parseInt(data["width"]);
  this.body.height = parseInt(data["height"]);

  if(data.animated) {
    data.animated = data.animated.toString().split(",").map(value => Number(value));
    this.howManyAnimationsPerSec = data.animated.pop();
    this.animations.add("animation", data.animated, this.howManyAnimationsPerSec, true);
    this.animations.play("animation");
  }
}

Entity.prototype = Object.create(Phaser.Sprite.prototype);
Entity.prototype.constructor = Entity;
