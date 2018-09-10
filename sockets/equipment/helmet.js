let basicProperties = {
  defence : 0,
  strength : 0,
  intelligence : 0,
  vitality : 0,
  agility : 0,
  requiredLevel : 0,
  type : "helmet",
  description : "helmet"
}
let helmetArray = [
  {
    defence : 1,
    key : "helmet_1",
    requiredLevel : 1
  },
  {
    defence : 2,
    key : "helmet_2",
    vitality : 2,
    requiredLevel : 5
  }
];

let helmetDictionary = {};
helmetArray.forEach(helmetData => {
  if(!helmetData.key) {
    throw new Error("helmet without key !!!!");
  }
  helmetDictionary[helmetData.key] = {
    ...basicProperties,
    ...helmetData
  }
  delete helmetDictionary.key;
});

module.exports = helmetDictionary;
