class PlayerMoveManager {
  constructor(state){
    this.state = state;
    this.pointer = this.state.game.input.activePointer;
    this.state.playerShadow = new Player(this.state.game,{
      x : 0,
      y : 0
    });
    // this.state.playerShadow.visible = false;
    this.playerMoveList = [];
    this.state.playerShadow.alpha = 0;
    this.cursors = this.state.game.input.keyboard.createCursorKeys();
  }

  update(){
    if(this.pointer.isDown){
      let goal = {
        x : this.pointer.worldX,
        y : this.pointer.worldY
      };

      let goalPoint = new ASearchPoint(goal.x,goal.y,-1,0);
      if(this.checkCollisionAtPoint(goalPoint)){
        return;
      }
      let openList = new ASearchList();
      let closedList = new ASearchList();
      let playerSpeed = this.state.player.realSpeed;
      this.state.playerShadow.x = this.state.player.x;
      this.state.playerShadow.y = this.state.player.y;
      openList.push(new ASearchPoint(this.state.playerShadow.x, this.state.playerShadow.y, 0, this.countDistance(goal,{x:this.state.playerShadow.x, y:this.state.playerShadow.y})));


      while(openList.length > 0){
        // openList = openList.sort((a,b) => a.f - b.f);

        let firstElement = openList.getSmallestFElement();
        if (firstElement == null) {
          console.log("WUTWUTWUT");
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
    };

    if(!this.state.player.isFighting){
      if(this.cursors.up.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.W)){
        this.playerMoveList = [];
        this.state.player.goUp();
      } else if(this.cursors.down.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.S)){
        this.playerMoveList = [];
        this.state.player.goDown();
      }  else if(this.cursors.left.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.A)){
        this.playerMoveList = [];
        this.state.player.goLeft();
      }  else if(this.cursors.right.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.D)){
        this.playerMoveList = [];
        this.state.player.goRight();
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
    if(this.state.physics.arcade.collide(this.state.entities, this.state.playerShadow)) {
      return true;
    } else if(this.state.physics.arcade.overlap(this.state.walls, this.state.playerShadow)) {
      return true;
    } else {
      return false;
    }
  };


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

    if(checkCollisionAtPoint(successor)){
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
