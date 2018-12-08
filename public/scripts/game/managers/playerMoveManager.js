class PlayerMoveManager {
  constructor(state) {
    this.state = state;
    this.state.playerShadow = new Player(this.state.game,{
      x : 0,
      y : 0
    });
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
    this.counter = 0;
    this.blockedMovement = 0;
    this.notVisibleXsesCount = 0;

    this.stepsLimit = 100;
  }

  blockPlayerMovement(num) {
    this.blockedMovement = num || 2;
  }

  unblockPlayerMovement() {
    this.blockedMovement = 0;
  }

  eraseXses(num) {
    num = num || 2;
    this.state.xGreen.visible = false;
    this.state.xRed.visible = false;
    this.notVisibleXsesCount = 2;
  }

  update() {
    if((Date.now() - this.lastTimeInputRead > this.xTimeout)) {
      this.state.xGreen.visible = false;
      this.state.xRed.visible = false;
    } else {
      this.state.xGreen.alpha = 1 - (Date.now() - this.lastTimeInputRead)/this.xTimeout;
      this.state.xRed.alpha = 1 - (Date.now() - this.lastTimeInputRead)/this.xTimeout;
    };

    // player has bloced movement <=> is doing some action
    if(!this.state.player.canMove || this.state.playerBlocked) {
      this.playerMoveList = [];
      this.state.player.body.velocity.setTo(0);
      return;
    };

    if(this.state.game.input.activePointer.isDown && (Date.now() - this.lastTimeInputRead > 250) && this.blockedMovement <= 0) {

      this.lastTimeInputRead = Date.now();
      let pointerX = this.state.game.input.activePointer.worldX;
      let pointerY = this.state.game.input.activePointer.worldY;
      let goal = {
        x : pointerX < 0 ? 0 - this.state.xGreen.width/4 : (pointerX > this.state.world.width - this.state.xGreen.width/4 ? this.state.world.width - this.state.xGreen.width/4 : pointerX),
        y : pointerY < 0 ? 0 : (pointerY > this.state.world.height - this.state.xGreen.height/2 ? this.state.world.height - this.state.xGreen.height : pointerY)
      };

      let goalPoint = new ASearchPoint(goal.x,goal.y,-1,0);
      if(this.checkCollisionAtPoint(goalPoint)) {
        goalPoint = this.getNearestPosition(goal);
        if(!goalPoint) {
          this.renderX("red", goal);
          return;
        } else {
          goal = {
            x : goalPoint.x,
            y : goalPoint.y,
          }
          this.renderX("green", goalPoint);
        }
      } else {
        this.renderX("green", goalPoint);
      };

      let openList = new ASearchList();
      let closedList = new ASearchList();
      let playerSpeed = this.state.player.realSpeed;
      this.state.playerShadow.reset(this.state.player.position.x,this.state.player.position.y);
      openList.push( new ASearchPoint(this.state.playerShadow.x, this.state.playerShadow.y, 0, this.countDistance_heuristic(goal,{x:this.state.playerShadow.x, y:this.state.playerShadow.y}), null, 0.1) );

      while(openList.getLength() > 0) {

        let firstElement = openList.getSmallestFElement();
        if (firstElement == null) {
          this.lastTimeInputRead = Date.now();
          return;
        };

        let rightSuccessor = this.handleSuccesor(firstElement,"right",playerSpeed,openList,closedList,goal);
        let leftSuccessor = this.handleSuccesor(firstElement,"left",playerSpeed,openList,closedList,goal);
        let topSuccessor = this.handleSuccesor(firstElement,"down",playerSpeed,openList,closedList,goal);
        let bottomSuccessor = this.handleSuccesor(firstElement,"up",playerSpeed,openList,closedList,goal);
        if(rightSuccessor) {
          this.lastTimeInputRead = Date.now();
          return this.createPath(rightSuccessor);
        } else if(leftSuccessor) {
          this.lastTimeInputRead = Date.now();
          return this.createPath(leftSuccessor);
        } else if(topSuccessor) {
          this.lastTimeInputRead = Date.now();
          return this.createPath(topSuccessor);
        } else if(bottomSuccessor) {
          this.lastTimeInputRead = Date.now();
          return this.createPath(bottomSuccessor);
        };

        closedList.push(firstElement);

      };

      this.renderX("red", goal);

    } else {
      if(this.blockedMovement > 0) {
        this.blockedMovement -= 1;
      }
    }

    if(this.state.player.canMove) {
      if(this.cursors.up.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        this.playerMoveList = [];
        this.state.player.goUp();
        // this.state.changeRenderOrder(this.state.player);
      } else if(this.cursors.down.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        this.playerMoveList = [];
        this.state.player.goDown();
        // this.state.changeRenderOrder(this.state.player);
      }  else if(this.cursors.left.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        this.playerMoveList = [];
        this.state.player.goLeft();
        // this.state.changeRenderOrder(this.state.player);
      }  else if(this.cursors.right.isDown || this.state.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        this.playerMoveList = [];
        this.state.player.goRight();
        // this.state.changeRenderOrder(this.state.player);
      } else if(this.playerMoveList.length > 0) {
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
        this.state.player.body.velocity.setTo(0);
        this.state.player.animations.stop();
      };
    };

  };

  getNearestPosition(goal) {

    let possibilities = [
      new ASearchPoint(goal.x - this.state.player.realSpeed,goal.y,-1,0),
      new ASearchPoint(goal.x - this.state.player.realSpeed,goal.y - this.state.player.realSpeed,-1,0),
      new ASearchPoint(goal.x - this.state.player.realSpeed,goal.y + this.state.player.realSpeed,-1,0),
      new ASearchPoint(goal.x + this.state.player.realSpeed,goal.y,-1,0),
      new ASearchPoint(goal.x + this.state.player.realSpeed,goal.y - this.state.player.realSpeed,-1,0),
      new ASearchPoint(goal.x + this.state.player.realSpeed,goal.y + this.state.player.realSpeed,-1,0),
      new ASearchPoint(goal.x,goal.y + this.state.player.realSpeed,-1,0),
      new ASearchPoint(goal.x,goal.y - this.state.player.realSpeed,-1,0)
    ]

    for(let i =0;i<possibilities.length;i++) {
      if(!this.checkCollisionAtPoint(possibilities[i])) {
        return possibilities[i];
      }
    }

    return false;

  }


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

  checkCollisionAtPoint(aSearchPoint) {
    this.state.playerShadow.reset(aSearchPoint.x, aSearchPoint.y);
    if(this.state.playerShadow.left + this.state.playerShadow.body.offset.x <= 0) {
      return true;
    } else if(this.state.playerShadow.top + this.state.playerShadow.body.offset.y <= 0) {
      return true;
    } else if(this.state.playerShadow.right - this.state.playerShadow.body.offset.x  >= this.state.world.width) {
      return true;
    } else if(this.state.playerShadow.bottom - (this.state.playerShadow.height - this.state.playerShadow.body.offset.y - this.state.playerShadow.body.height) >= this.state.world.height) {
      return true;
    } else if(this.state.physics.arcade.collide(this.state.entities, this.state.playerShadow)) {
      return true;
    } else if(this.state.physics.arcade.collide(this.state.fences, this.state.playerShadow)) {
      return true;
    } else {
      return false;
    }
  };

  renderX(color, coords) {
    if(this.notVisibleXsesCount > 0) {
      this.notVisibleXsesCount = 0;
      return;
    }
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

    if(firstElement.stepsFromStartPosition + this.countDistance_heuristic(goal, firstElement)/this.state.player.realSpeed > this.stepsLimit) { return; }

    let successor;
    if(direction == "right") {
      successor = new ASearchPoint(firstElement.x + playerSpeed,firstElement.y,firstElement.g + playerSpeed,this.countDistance_heuristic(goal,{x:firstElement.x + playerSpeed, y:firstElement.y}),firstElement);
    } else if(direction == "left") {
      successor = new ASearchPoint(firstElement.x - playerSpeed,firstElement.y,firstElement.g + playerSpeed,this.countDistance_heuristic(goal,{x:firstElement.x - playerSpeed, y:firstElement.y}),firstElement);
    } else if(direction == "up") {
      successor = new ASearchPoint(firstElement.x,firstElement.y - playerSpeed,firstElement.g + playerSpeed,this.countDistance_heuristic(goal,{x:firstElement.x, y:firstElement.y - playerSpeed}),firstElement);
    } else {
      successor = new ASearchPoint(firstElement.x,firstElement.y + playerSpeed,firstElement.g + playerSpeed,this.countDistance_heuristic(goal,{x:firstElement.x, y:firstElement.y + playerSpeed}),firstElement);
    };

    if(this.checkCollisionAtPoint(successor)) {
      return;
    } else if(this.nearGoal(successor,playerSpeed)) {
      return successor;
    } else if(openList.contains(successor) && openList.getConcreteEl(successor).f <= successor.f) {
      return;
    } else if(closedList.contains(successor)) {
      return;
    } else if(!openList.contains(successor)) {
      openList.push(successor);
    } else {
      openList.swap(successor);
    };
  };

  nearGoal(point,playerSpeed) {
    if (point.h < playerSpeed) {
      return true;
    } else {
      return false;
    }
  };

  countDistance_heuristic(goal,start) {
    return Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y);
  };

};

class ASearchPoint {
  constructor(x,y,g,h,parent, stepsFromStartPosition) {
    this.x = x;
    this.y = y;
    this.g = g;
    this.h = h;
    this.f = g + h;
    this.parent = parent;
    this.stepsFromStartPosition = stepsFromStartPosition || ( this.parent ? this.parent.stepsFromStartPosition + 1 : 1600 );
  }
};

class ASearchList {
  constructor() {
    this.list = {};
    this.arrayList = [];
  };

  push(aSearchPoint) {
    this.list[aSearchPoint.x + "A" + aSearchPoint.y] = aSearchPoint;
    this.addElementToArray(aSearchPoint);

  };

  addElementToArray(aSearchPoint) {
    for(let index = 0;index < this.arrayList.length; index++) {
      if(this.arrayList[index].f >= aSearchPoint.f) {
        this.arrayList.splice(index, 0, aSearchPoint);
        return;
      }
    }
    this.arrayList.push(aSearchPoint);
  }

  contains(aSearchPoint) {
    return this.list[aSearchPoint.x + "A" + aSearchPoint.y] != undefined;
  };

  getConcreteEl(aSearchPoint) {
    return this.list[aSearchPoint.x + "A" + aSearchPoint.y];
  };

  getLength() {
    return this.arrayList.length;
  }

  swap(aSearchPoint) {
    this.arrayList = this.arrayList.filter(function(el) {
      return el.x != aSearchPoint.x && el.y != aSearchPoint.y;
    })
    this.list[aSearchPoint.x + "A" + aSearchPoint.y] = aSearchPoint;
    this.addElementToArray(aSearchPoint);
  };

  getSmallestFElement() {
    if(this.getLength() == 0) {
      return null;
    }
    let smallestEl = this.arrayList.shift();
    delete this.list[smallestEl.x + "A" + smallestEl.y];
    return smallestEl;
  };
}
