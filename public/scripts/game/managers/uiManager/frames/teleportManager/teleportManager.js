class TeleportManager extends UIFrameManager {
  constructor(state,uiManager) {
    super(state,uiManager,null,null,'frame', false);
    this.currentTeleporter = null;
  }

  initialize() {
    let state = this.state;
    this.uiManager.addToGroup(this.frameGroup);

    this.basicDescription = this.state.add.text();
    this.state.styleText(this.basicDescription);
    this.basicDescription.text = "map:          price:";
    this.basicDescription.anchor.setTo(0);

    this.teleportsMenu = [];

    this.frameGroup.add(this.basicDescription);

    this.hideWindow();
    this.onResize();
  }

  hideTeleportsMenu() {
    this.teleportsMenu.forEach(menu => {
      menu.visible = false;
    })
  }

  onResize() {
    this.getPositionsCoords();
    this.basicDescription.reset(this.posX - 100, this.posY - 130);

    this.teleportsMenu.forEach((menu, index) => {
      menu.mapName.reset(this.posX - 100, this.posY - 70 + index * 30);
      menu.price.reset(this.posX - 5, this.posY - 70 + index * 30);
      menu.button.reset(this.posX + 75, this.posY - 70 - 3 + index * 30);
    })
    super.onResize();

    this.state.fixText(this.basicDescription);
  }

  emitTeleportSignal(teleport) {
    handler.socket.emit("teleport", {
      mapName : teleport.mapName
    })
  }

  showWindow(teleporter) {
    this.hideTeleportsMenu();
    this.currentTeleporter = teleporter;

    teleporter.teleports.forEach((teleportData, index) => {
      if(!this.teleportsMenu[index]) {
        this.teleportsMenu[index] = this.state.add.group();

        this.teleportsMenu[index].mapName = this.state.add.text();
        this.state.styleText(this.teleportsMenu[index].mapName);
        this.teleportsMenu[index].mapName.anchor.setTo(0,0.5);

        this.teleportsMenu[index].price = this.state.add.text();
        this.state.styleText(this.teleportsMenu[index].price);
        this.teleportsMenu[index].price.anchor.setTo(0,0.5);

        this.teleportsMenu[index].button =  new Button(this.state,0,0,"goButton",0,1,2,3);
        this.teleportsMenu[index].button.anchor.setTo(0.5);

        this.teleportsMenu[index].add(this.teleportsMenu[index].mapName);
        this.teleportsMenu[index].add(this.teleportsMenu[index].price);
        this.teleportsMenu[index].add(this.teleportsMenu[index].button);

        this.frameGroup.add(this.teleportsMenu[index]);
      } else {
        this.teleportsMenu[index].visible = true;
      }
      this.teleportsMenu[index].mapName.text = teleportData.mapName;
      this.teleportsMenu[index].price.text = teleportData.price;
      this.teleportsMenu[index].button.addOnInputDownFunction(function() {
        this.emitTeleportSignal(teleportData);
      }, this, true);

      this.teleportsMenu[index].mapName.reset(this.posX - 100, this.posY - 130 + index * 30);
      this.teleportsMenu[index].price.reset(this.posX - 40, this.posY - 130 + index * 30);
      this.state.fixText(this.teleportsMenu[index].mapName);
      this.state.fixText(this.teleportsMenu[index].price);
      this.teleportsMenu[index].button.reset(this.posX + 40, this.posY - 130 + index * 30);
    });
    this.onResize();
    super.showWindow();
  }

}
