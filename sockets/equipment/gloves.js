let basicProperties = {
  defence : 0,
  strength : 0,
  intelligence : 0,
  vitality : 0,
  agility : 0,
  requiredLevel : 0,
  type : "gloves"
}
let glovesArray = [
  {
    defence : 1,
    key : "gloves_1",
    requiredLevel : 1
  },
  {
    defence : 2,
    key : "gloves_2",
    vitality : 2,
    requiredLevel : 5
  }
];

let glovesDictionary = {};
glovesArray.forEach(glovesData => {
  if(!glovesData.key) {
    throw new Error("gloves without key !!!!");
  }
  glovesDictionary[glovesData.key] = {
    ...basicProperties,
    ...glovesData
  }
  delete glovesDictionary.key;
});

module.exports = glovesDictionary;
