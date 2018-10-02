const initializers = require("./listeners/initializers");
const equipmentListeners = require("./listeners/equipmentListeners");
const fightListeners = require("./listeners/fightListeners");
const playerStateListeners = require("./listeners/playerStateListeners");
const tradeListeners = require("./listeners/tradeListeners");

let socketHandler = (socket, io) => {

  // playerStatus listeners responsible for synchronizing clients/checkoing their state
  playerStateListeners(socket, io);

  // initlialize connection player <=> server
  initializers(socket);

  // equipment handlers
  equipmentListeners(socket);

  // fight handlers
  fightListeners(socket);

  // trade handlers
  tradeListeners(socket);

};

module.exports = {
  socketHandler
};
