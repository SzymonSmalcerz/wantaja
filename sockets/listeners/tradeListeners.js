const dm = require("../dataManager");
const equipment = require("../equipment/equipment");
const { getFirstFreePositionInPlayerEquipment,
        playerInRange,
        takeOffItem,
        addItemToEquipment  } = require("../equipment/equipment_utils");

function tradeListeners(socket) {

  socket.on("buyItem", function(data) {
    let plData = dm.allLoggedPlayersData[socket.playerID];
    let item;
    try {
      item = dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].traders[data.traderID].items.filter(item => {
        return item.positionX == data.itemX && item.positionY == data.itemY;
      })[0];
    } catch(e) {
      console.log(e);
      return;
    }
    if(!item) {
      return;
    }
    if(dm.allLoggedPlayersData[socket.playerID].money < item.price) {
      socket.emit("alert",{
        message : "you don't have enough\nmoney to buy this item!"
      });
    } else {
      if(addItemToEquipment({}, socket, item)) {
        dm.allLoggedPlayersData[socket.playerID].money -= item.price;
        socket.emit("updateMoney",{
          amount : dm.allLoggedPlayersData[socket.playerID].money
        });
      };
    }

  });
}

module.exports = tradeListeners;
