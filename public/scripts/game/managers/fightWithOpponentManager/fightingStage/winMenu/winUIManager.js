class WinUIManager extends Phaser.Group {
  constructor(fightingStageUIManager) {
    super(fightingStageUIManager.state.game);
    this.state = fightingStageUIManager.state;
    this.game = fightingStageUIManager.state.game;
    this.fightingStageUIManager = fightingStageUIManager;
  };

  initialize() {
    this.createWonAlert();
  };

  createWonAlert() {
    let state = this.state;


    this.wonInfo = state.game.add.sprite(-500,-500,"wonInfo");
    this.wonInfo.anchor.setTo(0.5);

    this.claimButton = new Button(state,-500,-500 + 120,"claimButton",0,0,1,2);
    this.claimButton.anchor.setTo(0.5);
    this.claimButton.addOnInputDownFunction(function() {
      this.state.uiManager.updateMoneyText();
      if(this.takeItem) {
        handler.socketsManager.emit('claimItem');
      }
    }, this);

    this.dropText = this.state.add.text(-500, -500);
    this.dropText.text = 'Your drop:';
    this.dropText.anchor.setTo(0.5);
    this.state.styleText(this.dropText);

    this.moneyText = this.state.add.text(-500, -500);
    this.state.styleText(this.moneyText);
    let textCss = {
      stroke : '#000',
      strokeThickness : 4,
      fill : '	#DAA520'
    };
    this.moneyText.setStyle(textCss);
    this.moneyIcon = state.add.sprite(-500 - 50,state.game.height-100,"moneyIcon");

    // this.item = state.game.add.sprite(-500, -500);
    this.item = new Button(this.state,0,0,'boots_1');
    this.item.addOnInputOverFunction(function() {
      this.itemDescription.show({
        ...this.data.drop.droppedItem,
        ...this.item.position,
        height : this.item.height
      });
      this.bringToTop(this.itemDescription);
    }, this);
    this.item.addOnInputOutFunction(function() {
      this.itemDescription.hide();
    }, this);
    this.item.anchor.setTo(0);
    this.itemDescription = new ItemDescription(this);
    this.itemCheckBox = new CheckBox(this,-500,-500,true,0,1,2,3,4,5,6,7,false,"checkbox_avatars");
    this.itemCheckBox.anchor.setTo(0);
    this.itemCheckBox.addOnCheckFunction(function() {
      this.takeItem = true;
    }, this);
    this.itemCheckBox.addOnUncheckFunction(function() {
      this.takeItem = false;
    }, this);

    this.add(this.wonInfo);
    this.add(this.claimButton);
    this.add(this.moneyText);
    this.add(this.moneyIcon);
    this.add(this.dropText);
    this.add(this.item);
    this.add(this.itemCheckBox);
    this.add(this.itemDescription);
    // this.fixedToCamera = true;
    this.visible = false;
  };

  showWonWindow(data) {
    this.data = data;
    this.itemDescription.visible = false;
    this.takeItem = true;
    this.moneyText.text = data.drop.droppedMoney + '$';
    handler.money += data.drop.droppedMoney;
    if(data.drop.droppedItem) {
      this.item.visible = true;
      this.itemCheckBox.visible = true;
      this.item.loadTexture(data.drop.droppedItem.key);
    } else {
      this.item.visible = false;
      this.itemCheckBox.visible = false;
      this.itemDescription.hide();
    }
    this.visible = true;
  }

  hideWonWindow() {
    this.visible = false;
  }

  onMapChange() {
    this.removeAll(true);
  }

  onResize() {
    this.getPositionsCoords();
    this.wonInfo.reset(this.posX,this.posY);
    this.dropText.reset(this.posX,this.posY - 90);
    this.moneyText.reset(this.posX - 10, this.posY + 12);
    this.moneyIcon.reset(this.posX - 65, this.posY + 10);
    this.claimButton.reset(this.posX ,this.posY + 93);
    this.item.reset(this.posX - 65 ,this.posY - 60);
    this.itemCheckBox.reset(this.posX + 12,this.posY - 57);
  }

  getPositionsCoords() {
    this.posX = Math.round(this.state.game.width/2);
    this.posY = Math.round(this.state.game.height/2);
  }

  activateEndOfFightButton(functionn, context) {
    this.game.world.bringToTop(this);
    this.claimButton.bringToTop();
    this.bringToTop(this.itemDescription);
    this.claimButton.addOnInputDownFunction(functionn,context,true);
  }
}
