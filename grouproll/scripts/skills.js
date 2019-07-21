class GroupSkillCheck extends Application {

  constructor(object, options) {
    super(options);

    this.skillName = "acr";
    this.abilityName = "dex";
    this.tokList = [];
    this.groupRoll = "";
  }

	static get defaultOptions() {
	  const options = super.defaultOptions;
	  options.id = "group-skill-check";
	  options.title = "Group Skill Check";
	  options.template = "public/modules/grouproll/templates/group-skill-check.html";
	  options.width = 450;
    options.height = "auto";
    options.resizable = true;
	  return options;
  }

  getData() {
    this.tokList = this.getTokenList(this.tokList, this.skillName, this.abilityName);
    return {
      tok: this.tokList,
      skl: this.skillName,
      abl: this.abilityName,
      skills: game.system.template.actor.data.skills,
      abilities: game.system.template.actor.data.abilities,
      rollresult: this.groupRoll
    };
  }

  getTokenList(tList, skillName, abilityName) {
    return canvas.tokens.controlledTokens.map(t => {
      let sklmod = t.actor.data.data.skills[skillName].mod;
      if ( abilityName !== t.actor.data.data.skills[skillName].ability ) sklmod = sklmod - t.actor.data.data.skills[skillName].value + t.actor.data.data.abilities[abilityName].mod;
      let tokRace = t.actor.data.data.details.race.value;
      let lucky = tokRace ? tokRace.toLowerCase().includes("halfling") : false;
      let oldToken = tList.find(x => x.id === t.id && x.name === t.name);
      let advNew = oldToken ? oldToken.adv : 0;
      let bonNew = oldToken ? oldToken.bon : 0;
      let advIcon = CONFIG._grouproll_module_advantageStatus[advNew].icon;
      let advHover = CONFIG._grouproll_module_advantageStatus[advNew].label;
      return {id: t.id, name: t.name, adv: advNew, icon: advIcon, hover: advHover, bon: bonNew, mod: sklmod, luck: lucky};
    })
  }

  doGroupCheck(tList, skl, abl) {
    let tRolls = tList.map(t => {
      return chkRoll(Number(t.adv), Number(t.bon), Number(t.mod), t.luck)
    });
    let tResults = tRolls.map(t => t.total);
    this.groupRoll = midValue(tResults);
//    console.log(tRolls); // uncomment this line to see the individuals rolls in the console
    this.render();
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [
      {
        label: "Update",
        class: "update-values",
        icon: "fas fa-redo",
        onclick: ev => this.render()
      },
      {
        label: "Roll",
        class: "roll-dice",
        icon: "fas fa-dice-d20",
        onclick: ev => this.doGroupCheck(this.tokList, this.skillName, this.abilityName)
      }
    ].concat(buttons);
    return buttons
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

    // Change roll bonus
    html.find('.bonus-value').change(event => {
      this.tokList = this.tokList.map(t => {
        t.bon = html.find('input[name="bon-' + t.id + '"]').val();
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
        return t;
      });
      this.render();
    });
  }

}


Hooks.on('renderSceneControls', (obj, html, data) => {
  if (obj.controls.token.tools.grouproll_skills == undefined) {
    obj.controls.token.tools.grouproll_skills = {
      name: "Group Skill Check",
      icon: "fas fa-user-check",
      onClick: () => {return new GroupSkillCheck().render(true)},
      visible: game.user.isGM
    };
    obj.render();
  };
  if (obj.controls.token.tools.grouproll_abilities == undefined) {
    obj.controls.token.tools.grouproll_abilities = {
      name: "Group Ability Check",
      icon: "fas fa-user-shield",
      onClick: () => {return new GroupAbilityCheck().render(true)},
      visible: game.user.isGM
    };
    obj.render();
  };
});
