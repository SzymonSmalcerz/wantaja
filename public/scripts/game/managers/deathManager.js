class DeathManager {
  constructor(state) {
    this.state = state;
    this.game = state.game;
    this.revivalTime = null;
    this.deathTime = null;
  }

  initialize() {
    this.state.deathImage = this.state.add.sprite(this.state.game.width/2,this.state.game.height/2,"background_death");
    this.state.deathImage.anchor.setTo(0.5);
    this.state.deathImage.visible = false;
    this.state.deathImage.inputEnabled = true;

    this.state.timeToRevival = this.state.add.text();
    this.state.timeToRevival.anchor.setTo(0.5);
    this.state.timeToRevival.text = "";
    this.state.styleText(this.state.timeToRevival);
    this.state.timeToRevival.fontSize = 30;
    this.state.timeToRevival.visible = false;

    this.state.youDied = this.state.add.text();
    this.state.youDied.anchor.setTo(0.5);
    this.state.youDied.text = "Death came for you..";
    this.state.styleText(this.state.youDied);
    this.state.youDied.fontSize = 30;
    this.state.youDied.visible = false;

    this.state.revivalText = this.state.add.text();
    this.state.revivalText.anchor.setTo(0.5);
    this.state.revivalText.text = "You will be revived in";
    this.state.styleText(this.state.revivalText);
    this.state.revivalText.fontSize = 30;
    this.state.revivalText.visible = false;


  }

  handleDeath(data) {
    this.deathTime = data.deathTime;
    this.revivalTime = data.revivalTime;
    this.state.player.reset(0,0);
    this.state.playerBlocked = true;
    this.show();
  }

  revive(data) {
    this.hide();
  }

  show() {
    this.game.world.bringToTop(this.state.deathImage);
    this.state.deathImage.visible = true;
    this.game.world.bringToTop(this.state.timeToRevival);
    this.state.timeToRevival.visible = true;
    this.game.world.bringToTop(this.state.youDied);
    this.state.youDied.visible = true;
    this.game.world.bringToTop(this.state.revivalText);
    this.state.revivalText.visible = true;
    this.updateTime();
    this.onResize();
  }

  updateTime() {
    if(this.revivalTime - this.deathTime >= 0) {
      this.state.timeToRevival.text = Math.floor( (this.revivalTime - this.deathTime)/1000 ) + " seconds";
      this.deathTime += 1000;
      let that = this;
      setTimeout(function() {
        that.updateTime();
      }, 1000)
    }
  }

  hide() {
    this.state.deathImage.visible = false;
  }

  onResize() {
    if(this.state.deathImage.visible) {
      this.state.deathImage.reset(this.state.game.width/2,this.state.game.height/2);
      this.state.timeToRevival.reset(this.state.game.width/2,this.state.game.height/2 + 150);
      this.state.youDied.reset(this.state.game.width/2,this.state.game.height/2 + 50);
      this.state.revivalText.reset(this.state.game.width/2,this.state.game.height/2 + 100);

      this.state.fixText(this.state.timeToRevival);
      this.state.fixText(this.state.youDied);
      this.state.fixText(this.state.revivalText);

      this.game.world.bringToTop(this.state.deathImage);
      this.game.world.bringToTop(this.state.timeToRevival);
      this.game.world.bringToTop(this.state.youDied);
      this.game.world.bringToTop(this.state.revivalText);
    }


    // let that = this;
    // setTimeout(function(){

    // }, 0);
  };

}
