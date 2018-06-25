class RenderManager {
  constructor(state){
    this.state = state;
    this.playerPos = {};
  }

  // this method is created to handle alpha channel of entities and tiles of map
  // if tile / entity is not visible then we dont want to render it
  setAlphaChannelToWorld(){
    this.updatePlayerPos();

    
  }

  updatePlayerPos(){
    this.playerPos = {
      x : this.state.player.x,
      y : this.state.player.y
    };
  }
}
