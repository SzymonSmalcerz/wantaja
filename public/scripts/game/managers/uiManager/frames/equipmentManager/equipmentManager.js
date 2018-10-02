class EquipmentManager extends UIFrameManager {
  constructor(state,uiManager){
    super(state,uiManager,Phaser.Keyboard.V,null,'equipmentFrame');
    this.notDressedUpEqLength = 4;
    this.notDressedUpEqHeight = 3;
  }

  initialize() {
    let state = this.state;
    state.equipmentManager = this.frameGroup;
    this.itemDescription = new ItemDescription(this);
    this.itemMenu = new ItemMenu(this, this.posX, this.posY);
    this.itemDiscardFrame = new ItemDiscardFrame(this, this.posX, this.posY);
    this.dressedUpEq = {};
    let arr = ["weapon","helmet","gloves","armor","shield","boots","special"];
    arr.forEach(type => {
      console.log(this.state.player.equipmentCurrentlyDressed);
      if(this.state.player.equipmentCurrentlyDressed[type]){
        let itemData = this.state.player.equipmentCurrentlyDressed[type].item;
        if(itemData) {
          this.dressedUpEq[type] = new Item(this, -500 , -500 , itemData, true);
          this.frameGroup.add(this.dressedUpEq[type]);
        }
      }

    });

    this.notDressedUpEq = [];
    for(let i = 0;i<this.notDressedUpEqHeight;i++) {
      for(let j = 0;j<this.notDressedUpEqLength;j++) {
        this.notDressedUpEq[i] = this.notDressedUpEq[i] || [];
        this.notDressedUpEq[i][j] = new Item(this, this.posX - 75 + i * 50 , this.posY - 25 + j * 50);
        this.notDressedUpEq[i][j].equipmentPositionX = j;
        this.notDressedUpEq[i][j].equipmentPositionY = i;
        this.notDressedUpEq[i][j].visible = false;
        this.frameGroup.add(this.notDressedUpEq[i][j]);
      }
    };

    this.state.player.equipment.forEach(row => {
      row.forEach(itemData => {
        if(itemData.placeTaken) {
          this.notDressedUpEq[itemData.item.y][itemData.item.x].changeView(itemData.item);
          this.notDressedUpEq[itemData.item.y][itemData.item.x].visible = true;
        }
      })
    });

    this.frameGroup.add(this.itemDescription);
    this.frameGroup.add(this.itemMenu);
    this.frameGroup.add(this.itemDiscardFrame);

    this.hideWindow();
    this.onResize();
  }

  getPositionsCoords() {
    super.getPositionsCoords();
    this.middleDressedItem = {
      x : this.posX,
      y : this.posY - 80
    }
    this.positions = {
      weapon : {
        x : this.middleDressedItem.x - 50,
        y : this.middleDressedItem.y
      },
      helmet : {
        x : this.middleDressedItem.x,
        y : this.middleDressedItem.y - 50
      },
      gloves : {
        x : this.middleDressedItem.x + 50,
        y : this.middleDressedItem.y + 50
      },
      armor : {
        x : this.middleDressedItem.x,
        y : this.middleDressedItem.y
      },
      shield : {
        x : this.middleDressedItem.x + 50,
        y : this.middleDressedItem.y
      },
      boots : {
        x : this.middleDressedItem.x,
        y : this.middleDressedItem.y + 50
      },
      special : {
        x : this.middleDressedItem.x - 50,
        y : this.middleDressedItem.y + 50
      },
    }
  }

  onResize() {
    this.getPositionsCoords();
    for (var type in this.dressedUpEq) {
      if (this.dressedUpEq.hasOwnProperty(type) && this.dressedUpEq[type]) {
          this.dressedUpEq[type].reset(this.positions[type].x , this.positions[type].y);
      }
    }
    for(let i = 0;i<this.notDressedUpEqHeight;i++) {
      for(let j = 0;j<this.notDressedUpEqLength;j++) {
        this.notDressedUpEq[i][j].reset(this.posX - 75 + j * 50 , this.posY + 25 + i * 50);
      }
    };

    this.itemMenu.reset(this.posX, this.posY + 25);
    this.itemDiscardFrame.reset(this.posX, this.posY + 25);
    super.onResize();
  }

  takeOffItem(itemData) {
    this.dressedUpEq[itemData.type].visible = false;
    this.notDressedUpEq[itemData.position.y][itemData.position.x].changeView(this.dressedUpEq[itemData.type]);
    this.notDressedUpEq[itemData.position.y][itemData.position.x].visible = true;
  }

  emitTakeOffItemSignal(item) {
    handler.socketsManager.emit('takeOffItem', {
      type : item.itemType
    });
  }

  dressItem(data) {
    let itemType = this.notDressedUpEq[data.currentlyWearItemOldPositions.y][data.currentlyWearItemOldPositions.x].itemType;
    if(data.newOldWearItemPositions) {
      this.notDressedUpEq[data.newOldWearItemPositions.y][data.newOldWearItemPositions.x].changeView(this.dressedUpEq[itemType]);
      this.notDressedUpEq[data.newOldWearItemPositions.y][data.newOldWearItemPositions.x].visible = true;
    }
    this.dressedUpEq[itemType].changeView(this.notDressedUpEq[data.currentlyWearItemOldPositions.y][data.currentlyWearItemOldPositions.x])
    this.dressedUpEq[itemType].visible = true;
    this.notDressedUpEq[data.currentlyWearItemOldPositions.y][data.currentlyWearItemOldPositions.x].visible = false;
  }

  emitDressItemSignal(item) {
    handler.socketsManager.emit('dressItem', {
      x : item.equipmentPositionX,
      y : item.equipmentPositionY
    })
  }

  showDiscardFrame(item) {
    this.itemDiscardFrame.show(item);
  }

  discardItem(data) {
    if(data.isCurrentlyWear) {
      this.dressedUpEq[data.type].visible = false;
    } else {
      this.notDressedUpEq[data.y][data.x].visible = false;
    }
  }

  emitDiscardItemSignal(item) {
    handler.socketsManager.emit('discardItem', {
      type : item.itemType,
      isCurrentlyWear : item.isCurrentlyWear,
      x : item.equipmentPositionX,
      y : item.equipmentPositionY
    });
  };

  addItemToNonDressEquipment(itemData) {
    this.notDressedUpEq[itemData.item.y][itemData.item.x].changeView(itemData.item);
    this.notDressedUpEq[itemData.item.y][itemData.item.x].visible = true;
  }

}
