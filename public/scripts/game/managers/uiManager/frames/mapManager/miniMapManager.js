class MiniMapManager extends UIFrameManager {
  constructor(state,uiManager) {
    super(state,uiManager,Phaser.Keyboard.J, 'Map', 'frame');
  }

  initialize() {

    let state = this.state;
    this.windowShowed = false;
    this.miniMapImage = this.state.game.add.sprite(0,0, '');
    this.miniMapImage.anchor.setTo(0.5)

    this.pointer = this.state.game.add.sprite(300,200, 'pointer');
    this.pointer.animations.add('glow', [0,1,2,3,2,1], 5, true);
    this.pointer.animations.play('glow');
    this.pointer.anchor.setTo(0.5)

    this.wholeWorldButton = new FlexibleTitledButton(state,0,0,'world map', null, false, true);
    this.uiManager.blockPlayerMovementsWhenOver(this.wholeWorldButton.uiGroupTile_normal, true);
    this.uiManager.blockPlayerMovementsWhenOver(this.wholeWorldButton.uiGroupTile_left, true);
    this.uiManager.blockPlayerMovementsWhenOver(this.wholeWorldButton.uiGroupTile_right, true);
    this.wholeWorldButton.addOnInputDownFunction(function() {
      this.uiManager.showWholeWorldMapWindow();
    }, this);

    this.frameGroup.add(this.miniMapImage);
    this.frameGroup.add(this.pointer);
    this.frameGroup.add(this.wholeWorldButton);

    this.hideWindow();
    this.onResize();
  }

  getPositionsCoords() {
    super.getPositionsCoords();
  }

  onResize() {
    this.getPositionsCoords();
    this.miniMapImage.reset(this.posX, this.posY);
    this.wholeWorldButton.reset(this.posX - this.wholeWorldButton.width/2, this.posY + 102);
    super.onResize();
  }

  showWindow() {
    this.miniMapImage.loadTexture(this.state.mapManager.mapName + '_mini');
    super.showWindow();
    this.updatePlayerPosition();
  }

  updatePlayerPosition() {
    let positionX = this.state.player.position.x/this.state.world.width - 0.5;
    let positionY = this.state.player.position.y/this.state.world.height - 0.5;
    this.pointer.reset(this.posX + this.miniMapImage.width * positionX, this.posY + this.miniMapImage.height * positionY);

    let that = this;
    this.windowShowed = true;
    setTimeout(function() {
      if(that && that.windowShowed) {
        that.updatePlayerPosition();
      }
    }, 500)
  }

  hideWindow() {
    this.windowShowed = false;
    super.hideWindow();
  }

}
