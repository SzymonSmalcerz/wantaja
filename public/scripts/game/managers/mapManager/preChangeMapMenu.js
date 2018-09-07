class PreChangeMapMenu {
  constructor(mapManager){
    this.state = mapManager.state;
    this.mapManager = mapManager;
  };

  initialize(){
    this.state.changeMapOptionsMenu = this.state.add.group();
    this.changeMapButton = new Button(this.state.game,-100,-100,"changeMapButton",0,0,1,2);
    this.changeMapButton.anchor.setTo(0.5);
    this.changeMapAbortButton = new Button(this.state.game,-100,-100,"closeButton",0,0,1,2);
    this.changeMapAbortButton.anchor.setTo(0.5);
    this.state.changeMapOptionsMenu.add(this.changeMapButton);
    this.state.changeMapOptionsMenu.add(this.changeMapAbortButton);
    this.state.changeMapOptionsMenu.visible = false;
  };

  showOptionsMenu(door) {
    let y = door.y > 1000 ? door.y - door.height/2 - 10 : door.y - door.height/2  + 50;
    this.changeMapButton.reset(door.x + door.width/2, y);
    this.changeMapAbortButton.reset(door.x + door.width/2, y + 50);

    this.changeMapButton.addOnInputDownFunction(function(){
      handler.socketsManager.emit("changeMap", {
        mapName : door.nextMapName,
        id : handler.playerData.id
      })
      this.state.changeMapOptionsMenu.visible = false;
    },this,true);

    this.changeMapAbortButton.addOnInputDownFunction(function(){
      this.state.changeMapOptionsMenu.visible = false;
    },this,true);
    this.state.changeMapOptionsMenu.visible = true;
  };
};
