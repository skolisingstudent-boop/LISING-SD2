console.log("Welcome to Session 21!");

// [Section] JavaScript Objects
// Imitates real-world objects and descriptions

let arr = [1, 2, 3, 4, 5];
let obj = {
    name: "Gonzales",
    age: 21,
};

console.log(arr);
console.log(obj);

let person = {
    fullName: "Popoy Barzaga",
    age: 21,
    height: 183,
    weight: 80,
};
console.log(person);

// Dot notation - Access value inside an object property
console.log(person.fullName);
console.log(`Hi, my name is ${person.fullName} and I am ${person.age} years old.`);

console.log(person['fullName']);

// Updating a value via dot notation
person.fullName = "Michael Barzaga";
console.log(person);

person.email = "Pipoy@mail.com";
console.log(person);

// Class and Objects
class Car {
    constructor(brand, fuel, displacement, seatCapacity) {
        this.brand = brand;
        this.fuel = fuel;
        this.displacement = displacement;
        this.seatCapacity = seatCapacity;
    }

    makeSound() {
        console.log("Vroom Vroom!");
    }
}

console.log(Car);

// Instance -> copy/duplicate of a class
let car = new Car("Toyota", "Gasoline", 1500, 5);
console.log(car);
console.log(car.brand);
car.makeSound();

let car2 = new Car("Honda", "Gasoline", 1500, 5);
console.log(car2);

// [SECTION] Pokemon

class Pokemon {
    constructor(name, level, baseHp, mana) {
        this.name = name;
        this.level = level;
        this.maxHp = baseHp * level;
        this.hp = this.maxHp;
        this.maxMana = mana;
        this.mana = mana;
        this.manaRegenUses = 10;
    }

    tackle(target) {
        let damage = 50;
        target.hp = Math.max(0, target.hp - damage);
        console.log(`${this.name} uses Tackle on ${target.name}!`);
        this.printPostSkillState('attack', this, target);
    }

    skill1(target) {
        let damage;
        let skillName;
        let manaCost = 20;

        if (this.name === "Pikachu") {
            skillName = "Thunderbolt";
            damage = 50 ;
        } else if (this.name === "Charmander") {
            skillName = "Flamethrower";
            damage = 40;
        } else {
            console.log(`${this.name} does not have a special skill.`);
            return;
        }

        if (this.mana < manaCost) {
            console.log(`${this.name} does not have enough mana to use ${skillName}!`);
            return;
        }

        target.hp = Math.max(0, target.hp - damage);
        this.mana -= manaCost;
        console.log(`${this.name} uses ${skillName} on ${target.name}!`);
        console.log(`${this.name} has ${this.mana} mana left.`);
        this.printPostSkillState('attack', this, target);
    }

    potion() {
        if (this.hp < this.maxHp) {
            this.hp = Math.min(this.maxHp, this.hp + 20);
            console.log(`${this.name} uses a potion on themselves!`);
            console.log(`${this.name} health: ${this.hp} HP`);
        } else {
            console.log(`${this.name} already has full HP!`);
        }
    }

    manaRegen() {
        let regenAmount = 15;
        if (this.manaRegenUses <= 0) {
            console.log(`${this.name} cannot activate mana regen anymore! No uses left.`);
            return;
        }
        if (this.mana >= this.maxMana) {
            console.log(`${this.name} already has full mana!`);
            return;
        }
        this.manaRegenUses -= 1;
        this.mana = Math.min(this.maxMana, this.mana + regenAmount);
        console.log(`${this.name} activates Mana Regen!`);
        console.log(`${this.name} mana: ${this.mana}/${this.maxMana}`);
        console.log(`${this.name} has ${this.manaRegenUses} mana regen uses remaining.`);
    }

    printCurrentState(pokemon) {
        console.log(`${pokemon.name} current state: hp ${pokemon.hp}/${pokemon.maxHp}, mana ${pokemon.mana}/${pokemon.maxMana}, regen uses ${pokemon.manaRegenUses}`);
    }

    printPostSkillState(skillType, pokemon1, pokemon2 = null) {
        if (skillType === 'attack') {
            this.printCurrentState(pokemon1);
            this.printCurrentState(pokemon2);
        } else {
            this.printCurrentState(pokemon1);
        }
    }
}

let pikachu = new Pokemon("Pikachu", 25, 100, 50);
console.log(pikachu);


let charmander = new Pokemon("Charmander", 20, 90, 40);
console.log(charmander);

pikachu.tackle(charmander);
pikachu.tackle(charmander);
pikachu.tackle(charmander);

console.log(charmander);

charmander.skill1(pikachu);
console.log(pikachu);
console.log(charmander);

charmander.skill1(pikachu);
console.log(pikachu);   
console.log(charmander); 

charmander.skill1(pikachu);
console.log(pikachu);
console.log(charmander);

charmander.potion();
charmander.potion();
charmander.potion();
console.log(charmander);
console.log(pikachu);

pikachu.skill1(charmander);
console.log(pikachu);   
console.log(charmander);

charmander.potion();
console.log(charmander);

// Testing manaRegen function
console.log("\n--- Testing Mana Regen ---");
pikachu.manaRegen();
console.log(pikachu);

charmander.skill1(pikachu);
console.log(charmander.mana);

charmander.manaRegen();
console.log(charmander);


