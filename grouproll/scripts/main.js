class GroupRoll5e extends Application {

  constructor(object, options) {
    super(options);
    this.tokList = [];
    this.mstList = {};
    this.groupRoll = "";
    Hooks.on("controlToken", (object, controlled) => {
      this.render();
    });
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.width = 500;
    options.height = "auto";
    options.resizable = false;
    return options;
  }

  doGroupCheck() {
    this.tokList = this.tokList.map(t => {
      t.roll = chkRoll(Number(t.adv), Number(t.bon), Number(t.mod), t.luck);
      this.mstList[t.id].roll = t.roll;
      return t;
    });
    let tResults = this.tokList.map(t => t.roll.total);
    this.groupRoll = midValue(tResults);
    this.render();
  }

  doPassiveCheck() {
    this.tokList = this.tokList.map(t => {
      t.roll = chkPassive(Number(t.adv), Number(t.bon), Number(t.mod));
      this.mstList[t.id].roll = t.roll;
      return t;
    });
    let tResults = this.tokList.map(t => t.roll.total);
    this.groupRoll = midValue(tResults);
    this.render();
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [
      {
        label: "Reset",
        class: "reset-values",
        icon: "fas fa-undo",
        onclick: ev => {
          canvas.tokens.ownedTokens.map(t => this.mstList[t.id] = {adv: 0, bon: 0, roll: {total: "", result: ""}});
          this.render();
        }
      },
      {
        label: "Passive",
        class: "no-dice",
        icon: "fas fa-lock",
        onclick: ev => this.doPassiveCheck()
      },
      {
        label: "Roll",
        class: "roll-dice",
        icon: "fas fa-dice-d20",
        onclick: ev => this.doGroupCheck()
      }
    ].concat(buttons);
    return buttons
  }

  // Update dialog display on changes to token selection
  // Hooks.on("controlToken", (object, controlled) => { this.render() });

  activateListeners(html) {
    super.activateListeners(html);

    // Change roll bonus
    html.find('.bonus-value').change(event => {
      this.tokList = this.tokList.map(t => {
        t.bon = html.find('input[name="bon-' + t.id + '"]').val();
        this.mstList[t.id].bon = t.bon;
        return t;
      });
      this.render();
    });

    // Toggle advantage status
    html.find('.advantage-mode').click(event => {
      event.preventDefault();
      let field = $(event.currentTarget).siblings('input[type="hidden"]');
      let level = Number(field.val());
      let newLevel = ( level === 1 ) ? -1 : level + 1;
      field.val(newLevel);
      this.tokList = this.tokList.map(t => {
        t.adv = html.find('input[name="adv-' + t.id + '"]').val();
        this.mstList[t.id].adv = t.adv;
        return t;
      });
      this.render();
    });
  }

}

class GroupSkillCheck extends GroupRoll5e {

  constructor(object, options) {
    super(options);
    this.skillName = "acr";
    this.abilityName = "dex";
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "group-skill-check";
    options.title = "Group Skill Check";
    options.template = "public/modules/grouproll/templates/group-skill-check.html";
    return options;
  }

  getData() {
    this.tokList = this.getTokenList(this.skillName, this.abilityName);
    return {
      tok: this.tokList,
      skl: this.skillName,
      abl: this.abilityName,
      skills: game.system.template.actor.data.skills,
      abilities: game.system.template.actor.data.abilities,
      rollresult: this.groupRoll
    };
  }

  getTokenList(skillName, abilityName) {
    return canvas.tokens.controlledTokens.map(t => {
      if (this.mstList[t.id] === undefined) {
        this.mstList[t.id] = {adv: 0, bon: 0, roll: {total: "", result: ""}};
      }
      let m = this.mstList[t.id];
      let sklmod = t.actor.data.data.skills[skillName].mod;
      if ( abilityName !== t.actor.data.data.skills[skillName].ability ) sklmod = sklmod - t.actor.data.data.skills[skillName].value + t.actor.data.data.abilities[abilityName].mod;
      let tokRace = t.actor.data.data.details.race.value;
      let lucky = tokRace ? tokRace.toLowerCase().includes("halfling") : false;
      let advIcon = CONFIG._grouproll_module_advantageStatus[m.adv].icon;
      let advHover = CONFIG._grouproll_module_advantageStatus[m.adv].label;
      return {id: t.id, name: t.name, adv: m.adv, icon: advIcon, hover: advHover, bon: m.bon, roll: m.roll, mod: sklmod, luck: lucky};
    })
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Change skill or ability
    html.find('select').change(event => {
      let newSkill = html.find('[name="select-skill"]').val();
      let newAbility = html.find('[name="select-ability"]').val();
      if (this.skillName !== newSkill) {
        this.skillName = newSkill;
        this.abilityName = game.system.template.actor.data.skills[this.skillName].ability;
      }
      else if (this.abilityName !== newAbility) this.abilityName = newAbility;
      this.render();
    });
  }

}

class GroupAbilityCheck extends GroupRoll5e {

  constructor(object, options) {
    super(options);
    this.saveRoll = false;
    this.abilityName = "dex";
  }

	static get defaultOptions() {
	  const options = super.defaultOptions;
	  options.id = "group-ability-check";
	  options.title = "Group Ability Check";
	  options.template = "public/modules/grouproll/templates/group-ability-check.html";
	  return options;
  }

  getData() {
    this.tokList = this.getTokenList(this.saveRoll, this.abilityName);
    return {
      tok: this.tokList,
      sav: this.saveRoll,
      abl: this.abilityName,
      abilities: game.system.template.actor.data.abilities,
      rollresult: this.groupRoll
    };
  }

  getTokenList(saveRoll, abilityName) {
    return canvas.tokens.controlledTokens.map(t => {
      if (this.mstList[t.id] === undefined) {
        this.mstList[t.id] = {adv: 0, bon: 0, roll: {total: "", result: ""}};
      }
      let m = this.mstList[t.id];
      let ablmod = saveRoll ? t.actor.data.data.abilities[abilityName].save : t.actor.data.data.abilities[abilityName].mod;
      let tokRace = t.actor.data.data.details.race.value;
      let lucky = tokRace ? tokRace.toLowerCase().includes("halfling") : false;
      let advIcon = CONFIG._grouproll_module_advantageStatus[m.adv].icon;
      let advHover = CONFIG._grouproll_module_advantageStatus[m.adv].label;
      return {id: t.id, name: t.name, adv: m.adv, icon: advIcon, hover: advHover, bon: m.bon, roll: m.roll, mod: ablmod, luck: lucky};
    })
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Change ability
    html.find('select').change(event => {
      let newAbility = html.find('[name="select-ability"]').val();
      if (this.abilityName !== newAbility) {
        this.abilityName = newAbility;
        this.saveRoll = false;
      }
      else if (this.abilityName !== newAbility) this.abilityName = newAbility;
      this.render();
    });

    // Toggle save roll
    html.find('input[type="checkbox"]').change(event => {
      this.saveRoll = event.target.checked;
      this.render();
    });
  }

}

Hooks.on('getSceneControlButtons', controls => {
  controls[0].tools.push(
    {
      name: "skill",
      title: "Group Skill Check",
      icon: "fas fa-user-check",
      visible: game.user.isGM,
      onClick: () => {
        controls[0].activeTool = "select";
        return new GroupSkillCheck().render(true);
      }
    },
    {
      name: "ability",
      title: "Group Ability Check",
      icon: "fas fa-user-shield",
      visible: game.user.isGM,
      onClick: () => {
        controls[0].activeTool = "select";
        return new GroupAbilityCheck().render(true);
      }
    }
  );
});
