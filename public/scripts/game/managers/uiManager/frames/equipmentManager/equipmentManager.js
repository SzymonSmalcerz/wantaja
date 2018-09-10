class EquipmentManager extends UIFrameManager {
  constructor(state,uiManager){
    super(state,uiManager,Phaser.Keyboard.V,null,'equipmentFrame');
    this.getPositionsCoords();
  }

  initialize() {
    let state = this.state;
    state.equipmentManager = this.frameGroup;

    this.itemDescription = new ItemDescription(this);
    console.log(this.state.player.equipmentCurrentlyDressed);
    this.getPositionsCoords();
    this.dressedUpEq = {};
    let arr = ["weapon","helmet","gloves","armor","shield","boots","special"];
    arr.forEach(type => {
      let key = this.state.player.equipmentCurrentlyDressed[type];
      if(key) {
        this.dressedUpEq[type] = new Item(this, this.positions[type].x , this.positions[type].y , key,0,1,2,3);
        this.frameGroup.add(this.dressedUpEq[type]);
      }
    });

    this.frameGroup.add(this.itemDescription);

    this.hideWindow();
    this.onResize();
  }


  getPositionsCoords() {
    super.getPositionsCoords();
    this.middleDressedItem = {
      x : this.posX - 85,
      y : this.posY - 123
    }
    this.positions = {
      weapon : {
        x : this.middleDressedItem.x - 25,
        y : this.middleDressedItem.y - 50
      },
      helmet : {
        x : this.middleDressedItem.x,
        y : this.middleDressedItem.y - 75
      },
      gloves : {
        x : this.middleDressedItem.x + 25,
        y : this.middleDressedItem.y - 25
      },
      armor : {
        x : this.middleDressedItem.x,
        y : this.middleDressedItem.y - 50
      },
      shield : {
        x : this.middleDressedItem.x + 25,
        y : this.middleDressedItem.y - 50
      },
      boots : {
        x : this.middleDressedItem.x,
        y : this.middleDressedItem.y - 25
      },
      special : {
        x : this.middleDressedItem.x - 25,
        y : this.middleDressedItem.y - 25
      },
    }
  }

  onResize() {
    this.getPositionsCoords();
    super.onResize();
  }
}
