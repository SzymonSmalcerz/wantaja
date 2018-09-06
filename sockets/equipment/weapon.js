let basicProperties = {
  minAttack : 1,
  maxAttack : 2,
  strength : 0,
  intelligence : 0,
  vitality : 0,
  agility : 0,
  requiredLevel : 0,
  type : "weapon"
}
let weaponArray = [
  {
    minAttack : 6,
    maxAttack : 10,
    key : "sword_1",
    requiredLevel : 1
  },
  {
    minAttack : 11,
    maxAttack : 15,
    key : "sword_2",
    strength : 2,
    requiredLevel : 5
  }
];

let weaponDictionary = {};
weaponArray.forEach(weaponData => {
  if(!weaponData.key) {
    throw new Error("weapon without key !!!!");
  }
  weaponDictionary[weaponData.key] = {
    ...basicProperties,
    ...weaponData
  }
  delete weaponDictionary.key;
});

module.exports = weaponDictionary;
