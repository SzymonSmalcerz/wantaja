let generateFence = function(state,data,group) {
  let x = data.x;
  let y = data.y;
  let offset = data.offset || 24;
  let bodySpace = data.bodySpace || 8;
  console.log(data);
  let type = data.type || "horizontal";
  let key = data.key || "fence" + "_" + type;
  let fencesArr = [];
  if(type == "horizontal") {
    let width = data.width;
    while(width > 0){
      let fencePart = state.game.add.sprite(x,y,key);
      fencePart.smoothed = false;
      group.add(fencePart);
      width -= fencePart.width;
      if(width < 0) {
        let rectangle = new Phaser.Rectangle(0,0,fencePart.width + width, fencePart.height);
        fencePart.crop(rectangle);
      }
      x += fencePart.width;
      fencePart.body.offset.y = offset;
      fencePart.body.height = bodySpace;
      fencePart.body.immovable = true;
      fencePart.body.width = fencePart.width;
      fencesArr.push(fencePart);
    }
  } else {
    let height = data.height;
    while(height > 0){
      let fencePart = state.game.add.sprite(x,y,key);
      fencePart.smoothed = false;
      group.add(fencePart);
      height -= fencePart.height;
      if(height < 0) {
        let rectangle = new Phaser.Rectangle(0,0,fencePart.width, fencePart.height + height);
        fencePart.crop(rectangle);
      }
      console.log("here");
      fencePart.body.immovable = true;
      fencePart.body.height = fencePart.height - (data.offsetY || 0);
      fencePart.body.offset.y = data.offsetY || 0;
      y += fencePart.height;

      fencesArr.push(fencePart);
    }
  }

  return fencesArr;
}
