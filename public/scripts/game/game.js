let handler = {}; // handler for our whole game

handler.game = new Phaser.Game(360,640, Phaser.CANVAS);



handler.game.state.add("PreState", PreState);
handler.game.state.add("LoadState", LoadState);
handler.game.state.add("HomeState", HomeState);
handler.game.state.add("GameState", GameState);
handler.game.state.start("PreState");

window.addEventListener("resize", () => {
  handler.game.scale.refresh();
});
