export class Player {
    /**
     *
     * @param name
     * @param experience
     * @param speed
     * @param weapon
     * @param level
     * @param maxHealth
     * @param currentHealth
     */
    constructor(name, experience, speed = 10, weapon) {
        this.id = 1;
        this.name = name;

        this.level = 1;
        this.experience = experience;

        this.maxHealth = 100;
        this.currentHealth = 100;

        this.speed = speed;
        this.weapon = weapon;

        this.strength = 10;
        this.intelligence = 10;
        this.dexterity = 10;
    }

    gainExp(experience, expChart) {
        this.experience += experience;

        let index = this.level -1;
        if(this.experience >= expChart[index]){
            console.log("you are experienced enough to level up. Ding!");
            console.log("you are now level", index + 2);
            this.level = index + 2;
            this.maxHealth += 15;

            return true;
        }
        else {
            console.log("you are level", this.level);
            return false;
        }
    }

    // calcDamage = () => {
    //     return this.weapon.damage * (this.strength / 10);
    // }
    //
    // calcArmor = () => {
    //     return 0;
    // }
}
