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
        const boost = 20;
        let newArmor = this.armor + boost;
        if (newArmor > this.maxArmor) {
            newArmor = this.maxArmor;
        }
        this.armor = newArmor;
        console.log(`${this.name} OVERCHARGES its core for emergency armor boost!`);
        console.log(`${this.name} gained +${boost} armor and now has ${this.energy} energy left.`);
    }

    energyRegen() {
        const regenAmount = 25;
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
    }
}

// === BABO ROBOT ===
// A fun console-based robot battle game
// Two rival robots battle in the BABO ARENA!
// (No Math.min or Math.max used — only pure if/else logic!)

console.log("=====================================");
console.log("         🔥 BABO ROBOT 🔥         ");
console.log("     Epic Robot Battle Arena     ");
console.log("=====================================");

let megaBot = new Robot("MegaBot", 28, 110, 70);
console.log("\nPlayer 1:", megaBot);

let stealthBot = new Robot("StealthBot", 22, 95, 55);
console.log("Player 2:", stealthBot);

console.log("\n--- BATTLE START! LET THE FIGHT BEGIN ---");

// ROUND 1
console.log("\n[ROUND 1] MegaBot charges in!");
megaBot.strike(stealthBot);
megaBot.strike(stealthBot);
megaBot.strike(stealthBot);
console.log("\nStatus after Round 1:");
console.log(stealthBot);

// ROUND 2
console.log("\n[ROUND 2] StealthBot fights back!");
stealthBot.special(megaBot);
console.log(megaBot);
stealthBot.strike(megaBot);
console.log(megaBot);
stealthBot.special(megaBot);
console.log(megaBot);

// ROUND 3
console.log("\n[ROUND 3] MegaBot unleashes heavy firepower!");
megaBot.special(stealthBot);
console.log(stealthBot);
megaBot.strike(stealthBot);
megaBot.strike(stealthBot);
console.log(stealthBot);

// ROUND 4
console.log("\n[ROUND 4] StealthBot uses repair, overcharge, and energy regen!");
stealthBot.repair();
stealthBot.overcharge();
stealthBot.energyRegen();
console.log(stealthBot);
stealthBot.strike(megaBot);
console.log(megaBot);

// ROUND 5
console.log("\n[ROUND 5] MegaBot repairs and strikes back!");
megaBot.repair();
console.log(megaBot);
megaBot.special(stealthBot);
console.log(stealthBot);
megaBot.strike(stealthBot);
console.log(stealthBot);

// ROUND 6
console.log("\n[ROUND 6] StealthBot goes on full offensive!");
stealthBot.special(megaBot);
console.log(megaBot);
stealthBot.special(megaBot);
console.log(megaBot);
stealthBot.strike(megaBot);
console.log(megaBot);

// ROUND 7
console.log("\n[ROUND 7] MegaBot tries to finish the fight!");
megaBot.special(stealthBot);
console.log(stealthBot);
megaBot.strike(stealthBot);
megaBot.strike(stealthBot);
console.log(stealthBot);

// ROUND 8 - Final intense round
console.log("\n[ROUND 8 - FINAL ROUND] Both robots give everything!");
stealthBot.repair();
console.log(stealthBot);
megaBot.overcharge();
console.log(megaBot);
stealthBot.special(megaBot);
console.log(megaBot);
megaBot.special(stealthBot);
console.log(stealthBot);
stealthBot.strike(megaBot);
console.log(megaBot);


if (megaBot.armor <= 0 || stealthBot.armor <= 0) {
    console.log("\n=====================================");
    console.log("           BATTLE OVER           ");
    console.log("=====================================");

    console.log("\nFinal Status:");
    console.log(megaBot);
    console.log(stealthBot);

    if (megaBot.armor > 0 && stealthBot.armor <= 0) {
        console.log(`🏆 MEGA BOT WINS THE BABO ARENA! 🏆`);
    } else if (stealthBot.armor > 0 && megaBot.armor <= 0) {
        console.log(`🏆 STEALTH BOT WINS THE BABO ARENA! 🏆`);
    } else {
        console.log("💥 Total destruction! The arena is empty.");
    }
}