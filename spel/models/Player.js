export class Player {
    constructor(name, experience, speed = 10, weapon) {
        this.id = 1;
        this.name = name;
        this.experience = experience;
        this.speed = speed;
        this.weapon = weapon;

        this.strength = 10;
        this.intelligence = 10;
        this.dexterity = 10;
    }

    gainExp = (experience) => {
        this.experience += experience;
    }

    calcDamage = () => {
        return this.weapon.damage * (this.strength / 10);
    }

    calcArmor = () => {
        return 0;
    }
}
