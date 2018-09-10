let basicProperties = {
  minAttack : 1,
  maxAttack : 2,
  strength : 0,
  intelligence : 0,
  vitality : 0,
  agility : 0,
  requiredLevel : 0,
  type : "weapon",
  description : "weapon"
}
let weaponArray = [
  {
    minAttack : 6,
    maxAttack : 10,
    key : "weapon_1",
    strength : 1,
    requiredLevel : 1,
    description : 'basic weapon,\nbetter than nothing'
  },
  {
    minAttack : 11,
    maxAttack : 15,
    key : "weapon_2",
    strength : 2,
    requiredLevel : 5,
    description : 'basic weapon,\nbetter than nothing'
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
