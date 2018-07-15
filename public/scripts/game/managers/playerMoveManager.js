class PlayerMoveManager {
  constructor(state){
    this.state = state;
    this.state.playerShadow = new Player(this.state.game,{
      x : 0,
      y : 0
    });
    this.state.playerShadow.anchor.setTo(0.5,0.5);
    this.playerMoveList = [];
    this.state.playerShadow.alpha = 0;
    this.cursors = this.state.game.input.keyboard.createCursorKeys();

    this.lastTimeInputRead = 0;

    this.state.xGreen = this.state.game.add.sprite(100,100,"xGreen");
    this.state.xGreen.anchor.setTo(0.5);
    this.state.xGreen.visible = false;
    this.state.xRed = this.state.game.add.sprite(100,200,"xRed");
    this.state.xRed.anchor.setTo(0.5);
    this.state.xRed.visible = false;

    this.playerBodyOffset = 20;
    this.xTimeout = 1500;
  }

  update(){

    if((Date.now() - this.lastTimeInputRead > this.xTimeout)){
      this.state.xGreen.visible = false;
      this.state.xRed.visible = false;
    } else {
      this.state.xGreen.alpha = 1 - (Date.now() - this.lastTimeInputRead)/this.xTimeout;
      this.state.xRed.alpha = 1 - (Date.now() - this.lastTimeInputRead)/this.xTimeout;
    };

    // player has bloced movement <=> is doing some action
    if(!this.state.player.canMove){
      this.playerMoveList = [];
      this.state.player.body.velocity.setTo(0);
      console.log("?");
      return;
    };

    if(this.state.game.input.activePointer.isDown && (Date.now() - this.lastTimeInputRead > 250) && this.state.uiManager.uiClickCounter < 0) {

      this.lastTimeInputRead = Date.now();
      let goal = {
        x : this.state.game.input.activePointer.worldX,
        y : this.state.game.input.activePointer.worldY - this.playerBodyOffset
      };

      let goalPoint = new ASearchPoint(goal.x,goal.y,-1,0);
      if(this.checkCollisionAtPoint(goalPoint)){
        this.renderX("red", goal);
        return;
      } else {
        this.renderX("green", goal);
      };

      let openList = new ASearchList();
      let closedList = new ASearchList();
      let playerSpeed = this.state.player.realSpeed;
      this.state.playerShadow.reset(this.state.player.position.x,this.state.player.position.y);
      openList.push(new ASearchPoint(this.state.playerShadow.x, this.state.playerShadow.y, 0, this.countDistance(goal,{x:this.state.playerShadow.x, y:this.state.playerShadow.y})));


      while(openList.length > 0){

        let firstElement = openList.getSmallestFElement();
        if (firstElement == null) {
          return;
        };

        let rightSuccessor = this.handleSuccesor(firstElement,"right",playerSpeed,openList,closedList,goal);
        let leftSuccessor = this.handleSuccesor(firstElement,"left",playerSpeed,openList,closedList,goal);
        let topSuccessor = this.handleSuccesor(firstElement,"down",playerSpeed,openList,closedList,goal);
        let bottomSuccessor = this.handleSuccesor(firstElement,"up",playerSpeed,openList,closedList,goal);
        if(rightSuccessor){
          return this.createPath(rightSuccessor);
        } else if(leftSuccessor) {
          return this.createPath(leftSuccessor);
        } else if(topSuccessor) {
          return this.createPath(topSuccessor);
        } else if(bottomSuccessor) {
          return this.createPath(bottomSuccessor);
        };

        closedList.push(firstElement);

      };
      this.lastTimeInputRead = Date.now();
    };

    if(this.state.player.canMove){
      if(this.cursors.up.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        this.playerMoveList = [];
        this.state.player.goUp();
        this.state.changeRenderOrder(this.state.player);
      } else if(this.cursors.down.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        this.playerMoveList = [];
        this.state.player.goDown();
        this.state.changeRenderOrder(this.state.player);
      }  else if(this.cursors.left.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        this.playerMoveList = [];
        this.state.player.goLeft();
        this.state.changeRenderOrder(this.state.player);
      }  else if(this.cursors.right.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        this.playerMoveList = [];
        this.state.player.goRight();
        this.state.changeRenderOrder(this.state.player);
      } else if(this.playerMoveList.length > 0){
        let move = this.playerMoveList.pop();

        if(move == "up") {
          this.state.player.goUp();
        } else if(move == "down") {
          this.state.player.goDown();
        } else if(move == "right") {
          this.state.player.goRight();
        } else if(move == "left") {
          this.state.player.goLeft();
        };


        this.state.changeRenderOrder(this.state.player);
      } else {
        this.state.player.frame = 19;
        this.state.player.animations.stop();
        this.state.player.body.velocity.setTo(0);
      };
    };

  };

  createPath(aSearchPoint) {
    this.playerMoveList = [];
    let parent;
    let info;
    while(aSearchPoint.parent != null) {
      parent = aSearchPoint.parent;
      if(parent.x > aSearchPoint.x) {
        info = "left";
      } else if(parent.x < aSearchPoint.x) {
        info = "right";
      } else if(parent.y > aSearchPoint.y) {
        info = "up";
      } else {
        info = "down";
      }
      this.playerMoveList.push(info);
      aSearchPoint = parent;
    };
    return this.playerMoveList;
  };

  checkCollisionAtPoint(aSearchPoint){
    this.state.playerShadow.reset(aSearchPoint.x, aSearchPoint.y);
    if(aSearchPoint.x < 0 || aSearchPoint.y < 0 || aSearchPoint.x > this.state.world.width || aSearchPoint.y > this.state.world.height){
      return true;
    } else if(this.state.physics.arcade.collide(this.state.entities, this.state.playerShadow)) {
      return true;
    } else if(this.state.physics.arcade.overlap(this.state.walls, this.state.playerShadow)) {
      return true;
    } else {
      return false;
    }
  };

  renderX(color, coords) {
    if(color == "red") {
      this.state.xRed.reset(coords.x, coords.y + this.playerBodyOffset);
      this.state.xRed.visible = true;
      this.state.game.world.bringToTop(this.state.xRed);
      this.state.xGreen.visible = false;
    } else {
      this.state.xGreen.reset(coords.x, coords.y + this.playerBodyOffset);
      this.state.xGreen.visible = true;
      this.state.game.world.bringToTop(this.state.xGreen);
      this.state.xRed.visible = false;
    };
  }

  handleSuccesor(firstElement,direction,playerSpeed,openList,closedList,goal) {

    let successor;
    if(direction == "right"){
      successor = new ASearchPoint(firstElement.x + playerSpeed,firstElement.y,firstElement.g + playerSpeed,this.countDistance(goal,{x:firstElement.x + playerSpeed, y:firstElement.y}),firstElement);
    } else if(direction == "left"){
      successor = new ASearchPoint(firstElement.x - playerSpeed,firstElement.y,firstElement.g + playerSpeed,this.countDistance(goal,{x:firstElement.x - playerSpeed, y:firstElement.y}),firstElement);
    } else if(direction == "up"){
      successor = new ASearchPoint(firstElement.x,firstElement.y - playerSpeed,firstElement.g + playerSpeed,this.countDistance(goal,{x:firstElement.x, y:firstElement.y - playerSpeed}),firstElement);
    } else {
      successor = new ASearchPoint(firstElement.x,firstElement.y + playerSpeed,firstElement.g + playerSpeed,this.countDistance(goal,{x:firstElement.x, y:firstElement.y + playerSpeed}),firstElement);
    };

    if(this.checkCollisionAtPoint(successor)){
      return;
    } else if(this.nearGoal(successor,playerSpeed)) {
      return successor;
    } else if(openList.contains(successor) && openList.getConcreteEl(successor).f <= successor.f) {
      return;
    } else if(closedList.contains(successor) && closedList.getConcreteEl(successor).f <= successor.f) {
      return;
    } else if(!openList.contains(successor)) {
      openList.push(successor);
    } else {
      openList.swap(successor);
    };
  };

  nearGoal(point,playerSpeed){
    if (point.h < playerSpeed) {
      return true;
    } else {
      return false;
    }
  }
  countDistance(goal,start) {
    return Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y);
  };

};

class ASearchPoint {
  constructor(x,y,g,h,parent){
    this.x = x;
    this.y = y;
    this.g = g;
    this.h = h;
    this.f = g + h;
    this.parent = parent;
  }
};

class ASearchList {
  constructor(){
    this.list = {};
    this.length = 0;
  };

  push(aSearchPoint){
    this.list[aSearchPoint.x + "A" + aSearchPoint.y] = aSearchPoint;
    this.length += 1;
  };

  contains(aSearchPoint) {
    return this.list[aSearchPoint.x + "A" + aSearchPoint.y] != undefined;
  };

  getConcreteEl(aSearchPoint) {
    return this.list[aSearchPoint.x + "A" + aSearchPoint.y];
  };

  swap(aSearchPoint) {
    this.list[aSearchPoint.x + "A" + aSearchPoint.y] = aSearchPoint;
  }

  getSmallestFElement(){
    if (this.length == 0) {
      return null;
    };
    let smallestEl = {
      f : 10000000
    };
    let currEl = null;
    for (var id in this.list) {
      if (this.list.hasOwnProperty(id)) {
         currEl = this.list[id];
         if(currEl.f < smallestEl.f){
           smallestEl = currEl;
         };
      };
    };

    delete this.list[smallestEl.x + "A" + smallestEl.y];
    this.length -= 1;
    return smallestEl;
  };
}
