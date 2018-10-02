const dm = require("../dataManager");
const equipment = require("../equipment/equipment");


let getFirstFreePositionInPlayerEquipment = function(player) {
  let position = undefined;
  player.equipment.forEach((row, yPos) => {
    row.forEach((object, xPos) => {
      if(!position && !object.placeTaken) {
        position = {
          x : xPos,
          y : yPos
        }
      }
    })
  });
  return position;
}


let addItemToEquipment = function(data, socket, item) {

  let plData = dm.allLoggedPlayersData[socket.playerID];
  let map = dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]];

  if(!item) {
    if(map.items[data.itemID] && playerInRange(plData, map.items[data.itemID])) {
      item = {
        ...map.items[data.itemID]
      };
      map.removeItem(data.itemID);
    } else {
      return;
    }
  }

  let itemEqPosition = getFirstFreePositionInPlayerEquipment(plData);
  if(!itemEqPosition) {
    socket.emit("alert",{
      message : `you don't have enough free\nspace in your equipment!\n`
    });
    return;
  }
  plData.equipment[itemEqPosition.y][itemEqPosition.x].item = {
    ...itemEqPosition,
    ...equipment[item.type][item.key]
  }
  plData.equipment[itemEqPosition.y][itemEqPosition.x].placeTaken = true;
  socket.emit("addItemToEquipment", plData.equipment[itemEqPosition.y][itemEqPosition.x]);
  
  return true;

}

let takeOffItem = function(plData, item) {
  if(!item) {
    console.log(`item doesn't exists`);
    return;
  }

  let type = item.type;
  let position = undefined;
  plData.equipment.forEach((row, yPos) => {
    row.forEach((object, xPos) => {
      if(!position && !object.placeTaken) {
        position = {
          x : xPos,
          y : yPos
        }
        plData.additionalAgility -= plData.equipmentCurrentlyDressed[type].item.agility;
        plData.additionalStrength -= plData.equipmentCurrentlyDressed[type].item.strength;
        plData.additionalIntelligence -= plData.equipmentCurrentlyDressed[type].item.intelligence;
        plData.additionalVitality -= plData.equipmentCurrentlyDressed[type].item.vitality;

        plData.equipment[yPos][xPos].item = plData.equipmentCurrentlyDressed[type].item;
        plData.equipment[yPos][xPos].placeTaken = true;

        plData.equipmentCurrentlyDressed[type].placeTaken = false;
      }
    })
  });

  if(position) {
    return position;
  } else {
    return false;
  }
}

let playerInRange = function(playerData, entity, range) {
  xDifference = playerData.x - entity.x;
  yDifference = playerData.y - entity.y;
  range = range || 100;
  //check if player is in range of the entity
  if(Math.abs(xDifference) < range && Math.abs(yDifference) < range) {
    return true;
  } else {
    return false;
  }
}


module.exports = {
  getFirstFreePositionInPlayerEquipment,
  playerInRange,
  takeOffItem,
  addItemToEquipment
}
