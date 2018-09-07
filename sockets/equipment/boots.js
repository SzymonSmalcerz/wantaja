let basicProperties = {
  defence : 0,
  strength : 0,
  intelligence : 0,
  vitality : 0,
  agility : 0,
  requiredLevel : 0,
  type : "boots"
}
let bootsArray = [
  {
    defence : 1,
    key : "boots_1",
    requiredLevel : 1
  },
  {
    defence : 2,
    key : "boots_2",
    vitality : 2,
    requiredLevel : 5
  }
];

let bootsDictionary = {};
bootsArray.forEach(bootsData => {
  if(!bootsData.key) {
    throw new Error("boots without key !!!!");
  }
  bootsDictionary[bootsData.key] = {
    ...basicProperties,
    ...bootsData
  }
  delete bootsDictionary.key;
});

module.exports = bootsDictionary;
