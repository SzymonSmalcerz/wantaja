let basicProperties = {
  defence : 0,
  strength : 0,
  intelligence : 0,
  vitality : 0,
  agility : 0,
  requiredLevel : 0,
  type : "armor"
}
let armorArray = [
  {
    defence : 1,
    key : "armor_1",
    vitality : 1,
    requiredLevel : 1
  },
  {
    defence : 2,
    key : "armor_2",
    vitality : 2,
    requiredLevel : 5
  }
];

let armorDictionary = {};
armorArray.forEach(armorData => {
  if(!armorData.key) {
    throw new Error("armor without key !!!!");
  }
  armorDictionary[armorData.key] = {
    ...basicProperties,
    ...armorData
  }
  delete armorDictionary.key;
});

module.exports = armorDictionary;
