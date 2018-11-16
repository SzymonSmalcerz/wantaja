let asd = {};
class DialogWindow extends Phaser.Group {
  constructor(missionManager) {
    super(missionManager.state.game);
    this.state = missionManager.state;
    this.missionManager = missionManager;
    this.tileHeight = 220;
    this.tileWidth = 70;
    this.initialize();
  };

  initialize() {
    this.getPositionsCoords();
    this.fixedToCamera = true;
    let state = this.state;
    this.uiGroupTile_normal = state.add.tileSprite(40,state.game.height-this.tileHeight,state.game.width - 80,this.tileWidth,"normalTileMission");
    this.uiGroupTile_left = state.add.sprite(0,state.game.height-this.tileHeight,"leftTileMission");
    this.uiGroupTile_right = state.add.sprite(state.game.width-this.tileWidth,state.game.height-this.tileHeight,"rightTileMission");
    this.uiGroupTile_middle = state.add.sprite(this.posX - 50,state.game.height-200,"middleTileMission");

    this.add(this.uiGroupTile_normal);
    this.add(this.uiGroupTile_left);
    this.add(this.uiGroupTile_right);
    this.add(this.uiGroupTile_middle);


    this.missionDescription = state.add.text();
    this.missionDescription.text = "";
    this.state.styleText(this.missionDescription);
    this.missionDescription.anchor.setTo(0.5,0);
    this.add(this.missionDescription);

    // this.responseButton = new TitledButton(this.state, 0, 0, "emptyButton",0,1,2,3,"",null,false);
    this.responseButton = new FlexibleTitledButton(state,0,0,'');
    // this.responseButton.anchor.setTo(0.5);
    this.add(this.responseButton);


    this.visible = false;

    this.onResize();
  };

  onMapChange() {
    this.removeAll(true);
  }

  showWindow(data) {
    this.responseButton.removeAllEvents();
    this.missionDescription.text = data.currentStage.dialogs.missionDescription;
    this.visible = true;
    this.missionManager.bringToTop(this);
    this.state.blockPlayer();
    this.responseButton.changeTitle(data.currentStage.dialogs.response);
    this.responseButton.addOnInputDownFunction(function() {
      this.hideWindow();
      console.log("clickeddd");
      handler.socket.emit('changeMissionStage', {
        missionName : data.missionName
      })
    }, this, true);
    this.onResize();
  }

  hideWindow() {
    this.visible = false;
    this.state.unblockPlayer();
  }

  getPositionsCoords() {
    this.posX = Math.floor(this.state.game.width/2);
    this.posY = Math.floor(this.state.game.height/2);
  }

  onResize() {
    let state = this.state;
    this.uiGroupTile_normal.reset(40,state.game.height-this.tileHeight,state.game.width - 80,this.tileWidth);
    this.uiGroupTile_normal.width = state.game.width - 80;
    this.uiGroupTile_normal.height = this.tileHeight;
    this.uiGroupTile_left.reset(0,state.game.height-this.tileHeight);
    this.uiGroupTile_right.reset(state.game.width-this.tileWidth,state.game.height-this.tileHeight);
    this.uiGroupTile_middle.reset(this.posX - 60,state.game.height - this.tileHeight - 50);

    this.missionDescription.reset(this.posX,state.game.height - 190);
    this.responseButton.reset(this.posX - this.responseButton.getWidth()/2,this.missionDescription.position.y + this.missionDescription.height + 10 - 25);
    // this.responseButton.reset(100,100);
    this.state.fixText(this.missionDescription);
  }
};
