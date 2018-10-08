class TradeManager extends UIFrameManager {
  constructor(state,uiManager) {
    super(state,uiManager,null,null,'tradeFrame', false);
    this.eqToSellLength = 4;
    this.eqToSellHeight = 5;
    this.currentTrader = null;
  }

  initialize() {
    let state = this.state;
    this.uiManager.addToGroup(this.frameGroup);
    this.itemDescription = new ItemDescription(this);
    this.itemMenu = new ItemMenuTrade(this, this.posX, this.posY);
    this.eqToSell = [];
    for(let h=0;h<this.eqToSellHeight;h++) {
      for(let l=0;l<this.eqToSellLength;l++) {
        this.eqToSell[h] = this.eqToSell[h] || [];
        this.eqToSell[h][l] = new Item(this, -500 , -500 , {
          x : l,
          y : h,
        }, true);
        this.frameGroup.add(this.eqToSell[h][l]);
      }
    }

    this.frameGroup.add(this.itemDescription);
    this.frameGroup.add(this.itemMenu);

    this.hideWindow();
    this.onResize();
  }

  getPositionsCoords() {
    super.getPositionsCoords();
    this.middleDressedItem = {
      x : this.posX,
      y : this.posY - 80
    }
  }

  onResize() {
    this.getPositionsCoords();
    for(let i = 0;i<this.eqToSellHeight;i++) {
      for(let j = 0;j<this.eqToSellLength;j++) {
        this.eqToSell[i][j].reset(this.posX - 75 + j * 50 , this.posY - 75 + i * 50);
      }
    };
    this.itemMenu.reset(this.posX, this.posY + 25);
    super.onResize();
  }

  emitBuyItemSignal(item) {
    console.log(item);
    if(handler.money < item.price) {
      this.uiManager.showAlert("you don't have enough\nmoney to buy this item!");
    } else {
      handler.socket.emit('buyItem', {
        traderID : this.currentTrader.id,
        itemX : item.equipmentPositionX,
        itemY : item.equipmentPositionY
      })
    }
  }

  hideitems() {
    this.eqToSell.forEach(row => {
      row.forEach(item => {
        item.hide();
      })
    })
  }

  showWindow(trader) {
    this.hideitems();
    trader.items.forEach(item => {
      this.eqToSell[item.positionY][item.positionX].changeView(item);
      this.eqToSell[item.positionY][item.positionX].reset(this.posX - 75 + item.positionX * 50 , this.posY - 75 + item.positionY * 50);
    });
    this.currentTrader = trader;
    super.showWindow();
  }

}
