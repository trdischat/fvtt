// Configure rolling behavior
CONFIG.averageRolls = true;         // Set to false to use normal 1d20 roll rather than averaging 2d20
CONFIG.halflingLuckEnabled = true;  // Set to false if Halfling Luck patch not applied

// Ability Types
CONFIG.abilityTypes = {
  "str": "Strength",
  "dex": "Dexterity",
  "con": "Constitution",
  "int": "Intelligence",
  "wis": "Wisdom",
  "cha": "Charisma"
};

// Skill Types
CONFIG.skillTypes = {
  "acr": {
    "label": "Acrobatics",
    "ability": "dex"
  },
  "ani": {
    "label": "Animal Handling",
    "ability": "wis"
  },
  "arc": {
    "label": "Arcana",
    "ability": "int"
  },
  "ath": {
    "label": "Athletics",
    "ability": "str"
  },
  "dec": {
    "label": "Deception",
    "ability": "cha"
  },
  "his": {
    "label": "History",
    "ability": "int"
  },
  "ins": {
    "label": "Insight",
    "ability": "wis"
  },
  "itm": {
    "label": "Intimidation",
    "ability": "cha"
  },
  "inv": {
    "label": "Investigation",
    "ability": "int"
  },
  "med": {
    "label": "Medicine",
    "ability": "wis"
  },
  "nat": {
    "label": "Nature",
    "ability": "int"
  },
  "prc": {
    "label": "Perception",
    "ability": "wis"
  },
  "prf": {
    "label": "Performance",
    "ability": "cha"
  },
  "per": {
    "label": "Persuasion",
    "ability": "cha"
  },
  "rel": {
    "label": "Religion",
    "ability": "int"
  },
  "slt": {
    "label": "Sleight of Hand",
    "ability": "dex"
  },
  "ste": {
    "label": "Stealth",
    "ability": "dex"
  },
  "sur": {
    "label": "Survival",
    "ability": "wis"
  }
};

// Advantage Types
CONFIG.advantageStatus = {
  "-1": {
    "label": "Disadvantage",
    "icon": '<i class="fas fa-minus"></i>'
  },
  "0": {
    "label": "Normal",
    "icon": '<i class="far fa-circle"></i>'
  },
  "1": {
    "label": "Advantage",
    "icon": '<i class="fas fa-plus"></i>'
  }
};

