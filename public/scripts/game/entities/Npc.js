
let Npc = function(state, data) {
  Button.call(this,state,data.x,data.y,data.key,0,0,1,false,false);
  this.anchor.setTo(0.5);
  state.game.physics.enable(this);
  this.id = data.id;
  this.inputEnabled = true;
  this.state = state;

  this.invovledMissionsDictionary = {};

  this.animated = data.animated || false;
  if(this.animated) {
    this.howManyAnimationsPerSec = this.animated.pop();
    this.animations.add("normalState", this.animated, this.howManyAnimationsPerSec, true);
    this.animations.add("hoverState", this.animated.map(val => val + this.animated.length), this.howManyAnimationsPerSec, true);
    this.events.destroy();
    this.addOnInputOverFunction(function() {
      if(!this.disabled) {
        this.animations.play("hoverState");
      };
    },this);
    this.addOnInputOutFunction(function() {
      if(!this.disabled) {
        this.animations.play("normalState");
      };
    },this);
    this.addOnInputDownFunction(function() {
      if(!this.disabled) {
        this.animations.play("hoverState");
      };
    },this);
    this.addOnInputUpFunction(function() {
      if(!this.disabled) {
        this.animations.play("normalState");
      };
    },this);
    this.animations.play("normalState");
  }

  this.events.onInputOver.add(function() {
    this.state.game.canvas.style.cursor = "pointer";
  }, this);

  this.events.onInputOut.add(function() {
    this.state.game.canvas.style.cursor = "default";
  }, this);

  this.addBasicListener();
}

Npc.prototype = Object.create(Button.prototype);
Npc.prototype.constructor = Npc;

Npc.prototype.reset = function(x,y,key) {
  Button.prototype.reset.call(this,x,y,key);
}

Npc.prototype.addBasicListener = function(x,y,key) {
  this.addOnInputDownFunction(function() {
    if(getDistanceBetweenEntityAndPlayer(this, this.state.player) <= 50) {
      this.state.blockPlayerMovement();
    }
    this.state.playerMoveManager.eraseXses();
  }, this);
}

Npc.prototype.highLight = function(data) {
  this.invovledMissionsDictionary[data.missionName] = true;
  this.addOnInputDownFunction(function() {
    if(getDistanceBetweenEntityAndPlayer(this, this.state.player) <= 50) {
      this.state.missionManager.showDialogWindow(data);
    }
  }, this);
  this.state.missionManager.addNewQuestionMark(this);
}

Npc.prototype.removeHighLight = function(missionName) {
  delete this.invovledMissionsDictionary[missionName];
  this.events.onInputDown.removeAll();

  this.state.missionManager.removeQuestionMark(this);
  this.addBasicListener();
  for (var missionName in this.invovledMissionsDictionary) {
    if (this.invovledMissionsDictionary.hasOwnProperty(missionName)) {
        this.highLight(handler.missions[missionName]);
    }
  }
}

Npc.prototype.kill = function() {
  Button.prototype.kill.call(this);
}
