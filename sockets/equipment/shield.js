let basicProperties = {
  defence : 0,
  strength : 0,
  intelligence : 0,
  vitality : 0,
  agility : 0,
  requiredLevel : 0,
  type : "shield"
}
let shieldArray = [
  {
    defence : 1,
    key : "shield_1",
    requiredLevel : 1
  },
  {
    defence : 2,
    key : "shield_2",
    vitality : 2,
    requiredLevel : 5
  }
];

let shieldDictionary = {};
shieldArray.forEach(shieldData => {
  if(!shieldData.key) {
    throw new Error("shield without key !!!!");
  }
  shieldDictionary[shieldData.key] = {
    ...basicProperties,
    ...shieldData
  }
  delete shieldDictionary.key;
});

module.exports = shieldDictionary;
