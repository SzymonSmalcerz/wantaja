
getDistanceBetweenEntityAndPlayer = function(entity, player){
  let entityCoords = {
    x : entity.left + entity.width/2,
    y : entity.bottom - entity.height/2
  };
  let playerCoords = {
    x : player.left + player.width/2,
    y : player.bottom - player.height/2
  };
  return Math.sqrt(Math.pow(entityCoords.x - playerCoords.x,2) + Math.pow(entityCoords.y - playerCoords.y,2));
};
