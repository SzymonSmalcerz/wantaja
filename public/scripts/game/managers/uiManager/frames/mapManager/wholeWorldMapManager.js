class WholeWorldMapManager extends UIFrameManager {
  constructor(state,uiManager) {
    super(state,uiManager,Phaser.Keyboard.H, 'World Map', 'frame');
  }

  initialize() {

    let state = this.state;

    this.mapsDictionary = [
      {
        name : 'Blackford',
        x : -1,
        y : -1
      },
      {
        name : 'Greengrove',
        x : 0,
        y : -1
      },
      {
        name : 'Northpool',
        x : 0,
        y : 0
      },
      {
        name : 'Southpool',
        x : 0,
        y : 1
      },
      {
        name : 'Frozendefile',
        x : 1,
        y : 1
      },
      {
        name : 'Winterfall',
        x : 1,
        y : 2
      }
    ];

    this.mapName = this.state.add.text();
    this.mapName.anchor.setTo(0.5,0);
    this.state.styleText(this.mapName);
    this.mapName.fontSize = 20;
    this.uiManager.blockPlayerMovementsWhenOver(this.mapName,true);

    this.mapsDictionary.forEach(data => {
      data.mapImage = new Button(state,0,0,data.name + "_tiny",0,1,2,3);

      if(data.name == handler.player.currentMapName) {
        data.mapImage.animations.add('glow', [4,5,6,7,6,5,4], 5, true);
        data.mapImage.animations.play('glow');
      }
      data.mapImage.addOnInputOverFunction(function() {
        this.mapName.reset(this.posX + data.x * 50, this.posY + data.y * 50 - 40);
        this.mapName.text = data.name;
        this.state.fixText(this.mapName);
        this.mapName.visible = true;
      }, this);
      data.mapImage.addOnInputOutFunction(function() {
        this.mapName.visible = false;
      }, this);

      this.uiManager.blockPlayerMovementsWhenOver(data.mapImage,true);

      this.frameGroup.add(data.mapImage);
    });


    this.frameGroup.add(this.mapName);
    this.hideWindow();
    this.onResize();
  }

  getPositionsCoords() {
    super.getPositionsCoords();
  }

  onResize() {
    this.getPositionsCoords();
    this.mapsDictionary.forEach(data => {
      data.mapImage.reset(this.posX + data.x * 50, this.posY + data.y * 50);
    });
    super.onResize();
  }

  hideWindow() {
    this.mapName.visible = false;
    super.hideWindow();
  }

}
