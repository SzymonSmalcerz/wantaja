let HomeState = {
  init() {
    this.game.stage.backgroundColor = "#000";
  },
  create() {
    this.game.stage.backgroundColor = '#ede5d8';
    this.buttons = this.game.add.group();
    this.startGameButton = new TitledButton(this,this.game.world.centerX, this.game.world.centerY - 100,"button",0,1,2,3,'start game',15);
    this.startGameButton.addOnInputDownFunction(function(){
      this.startGame();
    },this)
    this.buttons.setAll('smoothed', false);

    this.showPlayerAvatarPanelButton = new TitledButton(this,this.game.world.centerX, this.game.world.centerY + 100,"button",0,1,2,3,'change avatar',15);
    this.showPlayerAvatarPanelButton.addOnInputDownFunction(function(){
      this.showAvatarsDisplay();
    },this)

    this.homeScreenBackground = this.add.sprite(this.game.width/2, this.game.height/2,"background_homeState");
    this.homeScreenBackground.anchor.setTo(0.5);
    this.homeScreenBackground.smoothed = false;

    this.buttons.add(this.homeScreenBackground);
    this.buttons.add(this.startGameButton);
    this.buttons.add(this.showPlayerAvatarPanelButton);

    // player avatars
    this.playerAvatars = this.game.add.group();
    this.playerAvatars.visible = false;
    this.playerAvatars.setAll('smoothed', false);
    this.counter = 0;

    // player avatars sprites
    this.playerAvatarsSprites = this.game.add.group();
    this.playerAvatars.add(this.playerAvatarsSprites);
    // player avatars checkboxes
    this.playerAvatarsCheckboxes = this.game.add.group();
    this.playerAvatars.add(this.playerAvatarsCheckboxes);
    // player avatars texts
    this.playerAvatarsTexts = this.game.add.group();
    this.playerAvatars.add(this.playerAvatarsTexts);

    // scrollBar
    this.scrollBar = this.game.add.group();
    this.scrollBar.scrollBarSize = 50;
    this.scrollbar_middle = this.add.tileSprite(0,0,this.scrollBar.scrollBarSize,this.game.height,"scrollbar_middle");
    this.scrollbar_top = this.add.sprite(0,0,"scrollbar_top");
    this.scrollbar_bottom = this.add.sprite(0,0,"scrollbar_bottom");
    this.scrollbar_wheel = this.add.sprite(0,0,"scrollbar_wheel");
    this.scrollBar.add(this.scrollbar_middle);
    this.scrollBar.add(this.scrollbar_top);
    this.scrollBar.add(this.scrollbar_bottom);
    this.scrollBar.add(this.scrollbar_wheel);
    this.scrollBar.fixedToCamera = true;
    this.playerAvatars.add(this.scrollBar);

    this.goBackButton = new TitledButton(this,this.game.width - 250, this.game.height - 110,"button",0,1,2,3,'go back',15)
    this.goBackButton.addOnInputDownFunction(function(){
      this.showMainDisplay();
    },this)
    this.goBackButton.anchor.setTo(0);
    this.playerAvatars.add(this.goBackButton);

    this.onResize();
  },
  update() {
    this.scrollbar_wheel.y = this.game.height * (-this.game.world.y)/(this.game.world.height-this.game.height);
    this.scrollbar_wheel.y = Math.min(this.scrollbar_wheel.y,this.game.height-this.scrollBar.scrollBarSize*2);
    this.scrollbar_wheel.y = Math.max(this.scrollbar_wheel.y,this.scrollBar.scrollBarSize);
  },
  startGame() {
    this.game.kineticScrolling.stop();
    if(this.currentCheckBox != null) {
      handler.playerData.key = this.currentCheckBox.avatarKey;
    };
    this.playerAvatarsSprites.callAll('kill');
    this.playerAvatarsCheckboxes.callAll('kill');
    this.playerAvatarsTexts.callAll('kill');
    this.game.state.start("GameState");
  },
  toggleDisplays() {
    this.buttons.visible = !this.buttons.visible;
    this.playerAvatars.visible = !this.playerAvatars.visible;
    this.onResize();
  },
  showMainDisplay() {
    this.game.world.setBounds(0, 0, this.game.width, this.game.height);
    this.buttons.visible = true;
    this.playerAvatars.visible = false;
    this.onResize();
  },
  showAvatarsDisplay() {
    this.buttons.visible = false;
    this.playerAvatars.visible = true;
    this.onResize();
  },
  showPlayerAvatarPanel() {
    this.playerAvatarsSprites.callAll('kill');
    this.playerAvatarsCheckboxes.callAll('kill');
    this.playerAvatarsTexts.callAll('kill');
    // this.showAvatarsDisplay();
    let y = 120;
    let x = 32;
    let width;
    if(handler.playerData.gender == "male") {
      width = ( ( this.game,this.game.width - 64 ) / handler.playerAvatarDictionary.male.names.length );
      handler.playerAvatarDictionary.male.levels.forEach(level => {

        let avatarText = this.playerAvatarsTexts.getFirstExists(false);
        if(!avatarText){
          avatarText = this.add.text();
          this.playerAvatarsTexts.add(avatarText);
        };
        avatarText.reset(this.game.width/2 - this.scrollbar_top.width,y-70);
        handler.styleText(avatarText);
        avatarText.anchor.setTo(0.5);
        avatarText.alpha = 1.0;
        avatarText.text = 'sprites avaliable from ' + level + ' level:';

        if(level == 1) {
          let avatarSprite = this.playerAvatarsSprites.getFirstExists(false);
          if(!avatarSprite) {
            avatarSprite = this.game.add.sprite();
            this.playerAvatarsSprites.add(avatarSprite);
          };
          x = this.game.width/2 - this.scrollbar_top.width;
          avatarSprite.reset(x,y - 20);
          avatarSprite.anchor.setTo(0.5);
          avatarSprite.loadTexture('male_' + level);
          avatarSprite.frame = 18;

          let checkBox = this.playerAvatarsCheckboxes.getFirstExists(false);
          if(!checkBox) {
            checkBox = new CheckBox(this.game,x,y+30,false,0,1,2,3,4,5,6,7,false,"checkbox_avatars");
            this.playerAvatarsCheckboxes.add(checkBox);
            checkBox.addOnCheckFunction(function() {
              if(this.currentCheckBox) {
                this.currentCheckBox.uncheck();
              }
              this.currentCheckBox = checkBox;
            }, this);
            checkBox.addOnUncheckFunction(function() {
              if(this.currentCheckBox === checkBox) {
                this.currentCheckBox.uncheck();
                this.currentCheckBox = null;
              }
            }, this);
          }
          checkBox.reset(x,y+30);
          checkBox.anchor.setTo(0.5);
          checkBox.avatarKey = 'male_' + level;

          if(handler.playerData.key == checkBox.avatarKey) {
            checkBox.check();
            this.currentCheckBox = checkBox;
          } else {
            checkBox.uncheck();
          }
        } else {
          handler.playerAvatarDictionary.male.names.forEach(name => {

            let avatarSprite = this.playerAvatarsSprites.getFirstExists(false);
            if(!avatarSprite) {
              avatarSprite = this.game.add.sprite();
              this.playerAvatarsSprites.add(avatarSprite);
            };
            avatarSprite.reset(x,y - 20);
            avatarSprite.anchor.setTo(0.5);
            avatarSprite.loadTexture('male_' + level + '_' + name);
            avatarSprite.frame = 18;

            let checkBox = this.playerAvatarsCheckboxes.getFirstExists(false);
            if(!checkBox) {
              checkBox = new CheckBox(this.game,x,y+30,false,0,1,2,3,4,5,6,7,false,"checkbox_avatars");
              this.playerAvatarsCheckboxes.add(checkBox);
              checkBox.addOnCheckFunction(function() {
                if(this.currentCheckBox) {
                  this.currentCheckBox.uncheck();
                }
                this.currentCheckBox = checkBox;
              }, this);
              checkBox.addOnUncheckFunction(function() {
                if(this.currentCheckBox === checkBox) {
                  this.currentCheckBox.uncheck();
                  this.currentCheckBox = null;
                }
              }, this);
            } else {
              checkBox.reset(x,y+30);
            }
            checkBox.anchor.setTo(0.5);
            checkBox.avatarKey = 'male_' + level + '_' + name;

            if(handler.playerData.key == checkBox.avatarKey) {
              checkBox.check();
              this.currentCheckBox = checkBox;
            } else {
              checkBox.uncheck();
            }

            if(level > handler.playerData.level) {
              checkBox.disableCheckBox();
              avatarSprite.tint = 0x000000;
            }

            x+= width;
          });
        }

        y += 150;
        x = 32;
      });
    } else {
      console.log("showing female options");
    }
    this.game.kineticScrolling.start();
    this.game.world.setBounds(0, 0, this.game.width, y + 100);
    this.playerAvatars.bringToTop(this.goBackButton);
  },
  onResize(width, height) {
    if(this.buttons.visible) {
      this.startGameButton.reset(this.game.world.centerX, this.game.world.centerY - 100);
      this.showPlayerAvatarPanelButton.reset(this.game.world.centerX, this.game.world.centerY + 100);
      this.homeScreenBackground.reset(this.game.width/2, this.game.height/2);
    }
    if(this.playerAvatars.visible) {
      this.game.world.setBounds(0, 0, this.game.width, this.game.world.height || this.game.height);
      this.scrollbar_middle.reset(this.game.width-this.scrollBar.scrollBarSize,0);
      this.scrollbar_middle.width = this.scrollBar.scrollBarSize;
      this.scrollbar_middle.height = this.game.height;
      this.scrollbar_top.reset(this.game.width-this.scrollBar.scrollBarSize,0);
      this.scrollbar_bottom.reset(this.game.width-this.scrollBar.scrollBarSize,this.game.height-this.scrollBar.scrollBarSize);
      this.scrollbar_wheel.reset(this.game.width-this.scrollBar.scrollBarSize,this.game.height-100);
      this.showPlayerAvatarPanel();
      this.goBackButton.reset(this.game.width - 250, this.game.height - 110);
    }


  }
}
