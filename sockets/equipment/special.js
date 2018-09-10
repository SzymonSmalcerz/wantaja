let basicProperties = {
  defence : 0,
  strength : 0,
  intelligence : 0,
  vitality : 0,
  agility : 0,
  requiredLevel : 0,
  type : "special",
  description : "special"
}
let specialArray = [
  {
    defence : 1,
    key : "special_1",
    requiredLevel : 1
  },
  {
    defence : 2,
    key : "special_2",
    vitality : 2,
    requiredLevel : 5
  }
];

let specialDictionary = {};
specialArray.forEach(specialData => {
  if(!specialData.key) {
    throw new Error("special without key !!!!");
  }
  specialDictionary[specialData.key] = {
    ...basicProperties,
    ...specialData
  }
  delete specialDictionary.key;
});

module.exports = specialDictionary;
