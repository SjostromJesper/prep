export class Player {
    /**
     * @param id
     * @param name
     * @param experience
     * @param speed
     * @param weapon
     * @param level
     * @param maxHealth
     * @param currentHealth
     */
    constructor(id = 1, level, name, experience, speed = 10, weapon) {
        this.id = id;
        this.name = name;

        this.level = level;
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
        return false;
    }

    // calcDamage = () => {
    //     return this.weapon.damage * (this.strength / 10);
    // }
    //
    // calcArmor = () => {
    //     return 0;
    // }
}
