const dm = require("../dataManager");

function missionsListeners(socket) {
  socket.on("changeMissionStage", function(data) {
    dm.changeMissionStage(socket, data.missionName, true);
  });
}

module.exports = missionsListeners;
