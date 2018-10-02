const dm = require("../dataManager");
const equipment = require("../equipment/equipment");
const { getFirstFreePositionInPlayerEquipment,
        playerInRange,
        takeOffItem,
        addItemToEquipment  } = require("../equipment/equipment_utils");

function equipmentListeners(socket) {

  socket.on("takeOffItem", function(data) {
    let plData = dm.allLoggedPlayersData[socket.playerID];
    let item = plData.equipmentCurrentlyDressed[data.type].item;
    let result = takeOffItem(plData, item);
    if(result) {
      dm.playerFunctions.updatePlayerData(plData);
      socket.emit('takeOffItem', {
        type : item.type,
        position : result
      });
    } else {
      socket.emit('alert' , {
        message : `not enough space in equipment !`
      });
    }
  });

  socket.on("dressItem", function(data) {
    let plData = dm.allLoggedPlayersData[socket.playerID];
    let eqPlace = plData.equipment[data.y][data.x];

    if(!eqPlace) {
      console.log(`? :) eqPlace out of bounds`);
      return;
    } else if(!eqPlace.item || !eqPlace.placeTaken) {
      console.log(`item doesn't exists or this place is not occupied by any item`);
      return;
    } else if(eqPlace.item.requiredLevel > plData.level){
      socket.emit("alert",{
        message : `you don't have required level to\nwear this item! (required level: ${eqPlace.item.requiredLevel})`
      });
      return;
    }

    let item = eqPlace.item;

    let newOldWearItemPositions;
    if(plData.equipmentCurrentlyDressed[item.type].placeTaken) {
      newOldWearItemPositions = takeOffItem(plData, plData.equipmentCurrentlyDressed[item.type].item);
      if(!newOldWearItemPositions) {
        socket.emit('alert' , {
          message : `not enough space in equipment !`
        });
        return;
      }
    }



    plData.equipmentCurrentlyDressed[item.type].item = plData.equipment[data.y][data.x].item;
    plData.equipmentCurrentlyDressed[item.type].placeTaken = true;
    plData.additionalAgility += plData.equipmentCurrentlyDressed[item.type].item.agility;
    plData.additionalStrength += plData.equipmentCurrentlyDressed[item.type].item.strength;
    plData.additionalIntelligence += plData.equipmentCurrentlyDressed[item.type].item.intelligence;
    plData.additionalVitality += plData.equipmentCurrentlyDressed[item.type].item.vitality;
    plData.equipment[data.y][data.x].placeTaken = false;

    dm.playerFunctions.updatePlayerData(plData);

    socket.emit('dressItem', {
      newOldWearItemPositions,
      currentlyWearItemOldPositions : {
        x : data.x,
        y : data.y
      }
    });
  });

  socket.on("destroyItem", function(data) {
    let plData = dm.allLoggedPlayersData[socket.playerID];

    if(data.isCurrentlyWear) {
      if(!plData.equipmentCurrentlyDressed[data.type].item || !plData.equipmentCurrentlyDressed[data.type].placeTaken) {
        console.log(`? :) non item with type ${data.type} is wear by this player :o`);
        return;
      } else {
        plData.additionalAgility -= plData.equipmentCurrentlyDressed[data.type].item.agility;
        plData.additionalStrength -= plData.equipmentCurrentlyDressed[data.type].item.strength;
        plData.additionalIntelligence -= plData.equipmentCurrentlyDressed[data.type].item.intelligence;
        plData.additionalVitality -= plData.equipmentCurrentlyDressed[data.type].item.vitality;
        plData.equipmentCurrentlyDressed[data.type].placeTaken = false;
        dm.playerFunctions.updatePlayerData(plData);
      }
    } else {
      let eqPlace = plData.equipment[data.y][data.x];
      if(!eqPlace) {
        console.log(`? :) eqPlace out of bounds`);
        return;
      } else if(!eqPlace.item || !eqPlace.placeTaken) {
        console.log(`item doesn't exists or this place is not occupied by any item`);
        return;
      } else {
        plData.equipment[data.y][data.x].placeTaken = false;
      }
    }

    socket.emit('discardItem', data);
  });

  socket.on("discardItem", function(data) {
    let plData = dm.allLoggedPlayersData[socket.playerID];
    let discardedItem;
    if(data.isCurrentlyWear) {
      if(!plData.equipmentCurrentlyDressed[data.type].item || !plData.equipmentCurrentlyDressed[data.type].placeTaken) {
        console.log(`? :) non item with type ${data.type} is wear by this player :o`);
        return;
      } else {
        discardedItem = plData.equipmentCurrentlyDressed[data.type].item;
        plData.additionalAgility -= plData.equipmentCurrentlyDressed[data.type].item.agility;
        plData.additionalStrength -= plData.equipmentCurrentlyDressed[data.type].item.strength;
        plData.additionalIntelligence -= plData.equipmentCurrentlyDressed[data.type].item.intelligence;
        plData.additionalVitality -= plData.equipmentCurrentlyDressed[data.type].item.vitality;
        plData.equipmentCurrentlyDressed[data.type].placeTaken = false;
        dm.playerFunctions.updatePlayerData(plData);
      }
    } else {
      let eqPlace = plData.equipment[data.y][data.x];
      if(!eqPlace) {
        console.log(`? :) eqPlace out of bounds`);
        return;
      } else if(!eqPlace.item || !eqPlace.placeTaken) {
        console.log(`item doesn't exists or this place is not occupied by any item`);
        return;
      } else {
        discardedItem = eqPlace.item;
        eqPlace.placeTaken = false;
      }
    }

    dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].addItem({
      x : dm.allLoggedPlayersData[socket.playerID].x,
      y : dm.allLoggedPlayersData[socket.playerID].y,
      key : discardedItem.key,
      type : discardedItem.type
    });

    socket.emit('discardItem', data);
  });

  socket.on("pickUpItem", function(data) {
    addItemToEquipment(data, socket)
  });

  socket.on("claimItem", function(data) {
    if(!dm.allLoggedPlayersData[socket.playerID].claimedItem){return};
    addItemToEquipment(data, socket, dm.allLoggedPlayersData[socket.playerID].claimedItem);
  });
}

module.exports = equipmentListeners;
