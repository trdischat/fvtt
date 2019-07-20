class GroupAbilityCheck extends Application {

  constructor(object, options) {
    super(options);

    this.saveRoll = false;
    this.abilityName = "dex";
    this.tokList = [];
    this.groupRoll = "";
  }

	static get defaultOptions() {
	  const options = super.defaultOptions;
	  options.id = "group-ability-check";
	  options.title = "Group Ability Check";
	  options.template = "public/modules/grouproll/templates/group-ability-check.html";
	  options.width = 450;
    options.height = "auto";
    options.resizable = true;
	  return options;
  }

  getData() {
    this.tokList = this.getTokenList(this.tokList, this.saveRoll, this.abilityName);
    return {
      tok: this.tokList,
      sav: this.saveRoll,
      abl: this.abilityName,
      abilities: CONFIG.abilityTypes,
      rollresult: this.groupRoll
    };
  }

  getTokenList(tList, saveRoll, abilityName) {
    return canvas.tokens.controlledTokens.map(t => {
      let ablmod = saveRoll ? t.actor.data.data.abilities[abilityName].save : t.actor.data.data.abilities[abilityName].mod;
      let tokRace = t.actor.data.data.details.race.value;
      let lucky = tokRace ? tokRace.toLowerCase().includes("halfling") : false;
      let oldToken = tList.find(x => x.id === t.id && x.name === t.name);
      let advNew = oldToken ? oldToken.adv : 0;
      let bonNew = oldToken ? oldToken.bon : 0;
      let advIcon = CONFIG.advantageStatus[advNew].icon;
      let advHover = CONFIG.advantageStatus[advNew].label;
      return {id: t.id, name: t.name, adv: advNew, icon: advIcon, hover: advHover, bon: bonNew, mod: ablmod, luck: lucky};
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
        onclick: ev => this.doGroupCheck(this.tokList, this.saveRoll, this.abilityName)
      }
    ].concat(buttons);
    return buttons
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

function runGroupAbilityCheck() {
  return new GroupAbilityCheck().render(true);
}