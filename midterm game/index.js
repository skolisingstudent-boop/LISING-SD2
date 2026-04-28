console.log("Welcome to BABO ROBOT - Epic Robot Battle Arena!");
console.log("Two rival robots will battle it out in the BABO ARENA!");
console.log("Let the battle begin!");

class Robot {
    constructor(name, level, baseArmor, energy) {
        this.name = name;
        this.level = level;
        this.maxArmor = baseArmor * level;
        this.armor = this.maxArmor;
        this.energy = energy;
        this.maxEnergy = energy;
        this.regenUses = 5;
    }

    strike(target) {
        const damage = 45;
        let newArmor = target.armor - damage;
        if (newArmor < 0) {
            newArmor = 0;
        }
        target.armor = newArmor;
        console.log(`${this.name} fires a rapid STRIKE at ${target.name}!`);
        console.log(`${target.name} armor: ${target.armor}/${target.maxArmor}`);
        this.printPostSkillState('attack', this, target);
    }

    special(target) {
        let damage;
        let skillName;
        let energyCost = 25;

        if (this.name === "MegaBot") {
            skillName = "PLASMA CANNON";
            damage = 70;
        } else if (this.name === "StealthBot") {
            skillName = "SHADOW MISSILES";
            damage = 55;
        } else {
            console.log(`${this.name} does not have a special weapon.`);
            return;
        }

        if (this.energy < energyCost) {
            console.log(`${this.name} does not have enough energy to fire ${skillName}!`);
            return;
        }

        let newArmor = target.armor - damage;
        if (newArmor < 0) {
            newArmor = 0;
        }
        target.armor = newArmor;
        this.energy -= energyCost;
        console.log(`${this.name} unleashes ${skillName} on ${target.name}!`);
        console.log(`${this.name} has ${this.energy} energy left.`);
        this.printPostSkillState('attack', this, target);
    }

    repair() {
        if (this.armor < this.maxArmor) {
            let newArmor = this.armor + 35;
            if (newArmor > this.maxArmor) {
                newArmor = this.maxArmor;
            }
            this.armor = newArmor;
            console.log(`${this.name} activates SELF-REPAIR nanites!`);
            console.log(`${this.name} armor: ${this.armor}/${this.maxArmor}`);
            this.printPostSkillState('regen', this);
        } else {
            console.log(`${this.name} already has full armor!`);
        }
    }

    overcharge() {
        if (this.energy < 15) {
            console.log(`${this.name} doesn't have enough energy to overcharge!`);
            return;
        }
        this.energy -= 15;
        let boost = 20;
        let newArmor = this.armor + boost;
        if (newArmor > this.maxArmor) {
            newArmor = this.maxArmor;
        }
        this.armor = newArmor;
        console.log(`${this.name} OVERCHARGES its core for emergency armor boost!`);
        console.log(`${this.name} gained +${boost} armor and now has ${this.energy} energy left.`);
        this.printPostSkillState('regen', this);
    }

    energyRegen() {
        let regenAmount = 25;
        if (this.regenUses <= 0) {
            console.log(`${this.name} cannot activate ENERGY REGEN anymore! No uses left.`);
            return;
        }
        if (this.energy >= this.maxEnergy) {
            console.log(`${this.name} already has full energy!`);
            return;
        }
        this.regenUses -= 1;
        let newEnergy = this.energy + regenAmount;
        if (newEnergy > this.maxEnergy) {
            newEnergy = this.maxEnergy;
        }
        this.energy = newEnergy;
        console.log(`${this.name} activates ENERGY REGEN protocol!`);
        console.log(`${this.name} energy: ${this.energy}/${this.maxEnergy}`);
        console.log(`${this.name} has ${this.regenUses} regen uses remaining.`);
        this.printPostSkillState('regen', this);
    }

    printCurrentState(robot) {
        console.log(`${robot.name} current state: armor ${robot.armor}/${robot.maxArmor}, energy ${robot.energy}/${robot.maxEnergy}, regen uses ${robot.regenUses}`);
    }

    printPostSkillState(skillType, robot1, robot2 = null) {
        if (skillType === 'attack') {
            this.printCurrentState(robot1);
            this.printCurrentState(robot2);
        } else {
            this.printCurrentState(robot1);
        }
    }

    // Turn-based attack - attacks one at a time
    attackOnce(target) {
        const damage = 45;
        let newArmor = target.armor - damage;
        if (newArmor < 0) {
            newArmor = 0;
        }
        target.armor = newArmor;
        console.log(`${this.name} attacks ${target.name}!`);
        console.log(`${target.name} takes ${damage} damage! Armor: ${target.armor}/${target.maxArmor}`);
    }

    // Turn-based special attack
    specialOnce(target) {
        let damage;
        let skillName;
        let energyCost = 25;

        if (this.name === "MegaBot") {
            skillName = "PLASMA CANNON";
            damage = 70;
        } else if (this.name === "StealthBot") {
            skillName = "SHADOW MISSILES";
            damage = 55;
        } else {
            console.log(`${this.name} does not have a special weapon.`);
            return false;
        }

        if (this.energy < energyCost) {
            console.log(`${this.name} does not have enough energy for ${skillName}!`);
            return false;
        }

        let newArmor = target.armor - damage;
        if (newArmor < 0) {
            newArmor = 0;
        }
        target.armor = newArmor;
        this.energy -= energyCost;
        console.log(`${this.name} uses ${skillName} on ${target.name}!`);
        console.log(`${target.name} takes ${damage} damage! Armor: ${target.armor}/${target.maxArmor}`);
        console.log(`${this.name} energy left: ${this.energy}/${this.maxEnergy}`);
        return true;
    }
}

// Turn-based battle function - robots attack one at a time
function battleTurnBased(robot1, robot2) {
    console.log("\n=====================================");
    console.log("    TURN-BASED BATTLE MODE          ");
    console.log("   Robots attack one at a time!    ");
    console.log("=====================================");

    let turn = 1;
    let currentAttacker = robot1;
    let currentTarget = robot2;

    while (robot1.armor > 0 && robot2.armor > 0) {
        console.log(`\n--- Turn ${turn} ---`);
        console.log(`${currentAttacker.name}'s turn!`);

        // Show current state
        console.log(`${robot1.name}: Armor ${robot1.armor}/${robot1.maxArmor} | Energy ${robot1.energy}/${robot1.maxEnergy}`);
        console.log(`${robot2.name}: Armor ${robot2.armor}/${robot2.maxArmor} | Energy ${robot2.energy}/${robot2.maxEnergy}`);

        // Alternate between strike and special
        let useSpecial = Math.random() > 0.5;

        if (useSpecial) {
            currentAttacker.specialOnce(currentTarget);
        } else {
            currentAttacker.attackOnce(currentTarget);
        }

        // Check if battle is over
        if (currentTarget.armor <= 0) {
            break;
        }

        // Switch turns
        if (currentAttacker === robot1) {
            currentAttacker = robot2;
            currentTarget = robot1;
        } else {
            currentAttacker = robot1;
            currentTarget = robot2;
        }
        turn++;
    }

    console.log("\n=====================================");
    console.log("           BATTLE OVER             ");
    console.log("=====================================");

    if (robot1.armor > 0) {
        console.log(`🏆 ${robot1.name} WINS! 🏆`);
    } else if (robot2.armor > 0) {
        console.log(`🏆 ${robot2.name} WINS! 🏆`);
    } else {
        console.log("💥 Both robots destroyed!");
    }
}

// Character selection function
function chooseCharacter() {
    console.log("\n=====================================");
    console.log("      CHOOSE YOUR ROBOT           ");
    console.log("=====================================");
    console.log("1. MegaBot - High damage, more armor");
    console.log("   Special: PLASMA CANNON (70 dmg)");
    console.log("2. StealthBot - Balanced, tricky");
    console.log("   Special: SHADOW MISSILES (55 dmg)");
    console.log("=====================================");
    
    // Simple selection - in a real game, this would use readline or prompt
    // For now, we'll randomly assign or use a default
    const choice = Math.floor(Math.random() * 2) + 1;
    
    switch(choice) {
        case 1:
            console.log("\n⚡ You chose MEGABOT! ⚡");
            return { player: "MegaBot", opponent: "StealthBot" };
        case 2:
            console.log("\n🌐 You chose STEALTHBOT! 🌐");
            return { player: "StealthBot", opponent: "MegaBot" };
        default:
            console.log("\n⚠️ Invalid choice! Defaulting to MegaBot.");
            return { player: "MegaBot", opponent: "StealthBot" };
    }
}

// Computer AI - makes the enemy robot play automatically
function computerPlay(robot, target) {
    // Randomly choose an action for the computer
    const action = Math.floor(Math.random() * 4);
    
    switch(action) {
        case 0:
            robot.strike(target);
            break;
        case 1:
            robot.special(target);
            break;
        case 2:
            robot.repair();
            break;
        case 3:
            // Randomly choose between overcharge and energyRegen
            if (Math.random() > 0.5) {
                robot.overcharge();
            } else {
                robot.energyRegen();
            }
            break;
    }
}

// Battle start function - runs AFTER character selection
function startBattle(playerRobot, enemyRobot) {
    console.log("\n=====================================");
    console.log("       ⚔️ BATTLE START! ⚔️        ");
    console.log("=====================================");
    console.log(`\n${playerRobot.name} (YOU) VS ${enemyRobot.name} (CPU)`);
    console.log("Let the fight begin!");
    console.log("=====================================");
}
    // ROUND 1
    playerRobot.strike(enemyRobot);
    computerPlay(enemyRobot, playerRobot);

    // ROUND 2
    computerPlay(enemyRobot, playerRobot);
    playerRobot.strike(enemyRobot);
    computerPlay(enemyRobot, playerRobot);

    // ROUND 3
    playerRobot.special(enemyRobot);
    computerPlay(enemyRobot, playerRobot);
    playerRobot.strike(enemyRobot);

    // ROUND 4
    computerPlay(enemyRobot, playerRobot);
    computerPlay(enemyRobot, playerRobot);
    computerPlay(enemyRobot, playerRobot);
    playerRobot.strike(enemyRobot);

    // ROUND 5
    playerRobot.repair();
    computerPlay(enemyRobot, playerRobot);
    playerRobot.special(enemyRobot);

    // ROUND 6
    computerPlay(enemyRobot, playerRobot);
    computerPlay(enemyRobot, playerRobot);
    playerRobot.strike(enemyRobot);

    // ROUND 7
    playerRobot.special(enemyRobot);
    computerPlay(enemyRobot, playerRobot);
    playerRobot.strike(enemyRobot);

    // ROUND 8 - Final intense round
    computerPlay(enemyRobot, playerRobot);
    playerRobot.overcharge();
    computerPlay(enemyRobot, playerRobot);
    playerRobot.special(enemyRobot);
    computerPlay(enemyRobot, playerRobot);


    if (playerRobot.armor <= 0 || enemyRobot.armor <= 0) {
        console.log("\n=====================================");
        console.log("           BATTLE OVER           ");
        console.log("=====================================");

        console.log("\nFinal Status:");
        console.log(playerRobot);
        console.log(enemyRobot);
    }
// === BABO ROBOT ===
// A fun console-based robot battle game
// Two rival robots battle in the BABO ARENA!
// (No Math.min or Math.max used — only pure if/else logic!)

console.log("=====================================");
console.log("         🔥 BABO ROBOT 🔥         ");
console.log("     Epic Robot Battle Arena     ");
console.log("=====================================");

// Character selection
const selection = chooseCharacter();
console.log(`\nYour robot: ${selection.player}`);
console.log(`Enemy robot: ${selection.opponent}`);

let megaBot = new Robot("MegaBot", 28, 110, 70);
console.log("\nPlayer 1:", megaBot);

let stealthBot = new Robot("StealthBot", 22, 95, 55);
console.log("Player 2:", stealthBot);

// Start battle AFTER character selection
startBattle(megaBot, stealthBot);