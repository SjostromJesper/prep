import {experienceChart} from "../skillCharts";

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
        this.experience = experience;
        this.speed = speed;
        this.weapon = weapon;

        this.strength = 10;
        this.intelligence = 10;
        this.dexterity = 10;
    }

    gainExp = (experience, level, expChart) => {
        this.experience += experience;

        for (let key in expChart) {
            if (this.experience > experienceChart[level]) {
                level = key
            }
        }
    };

    calcDamage = () => {
        return this.weapon.damage * (this.strength / 10);
    }

    calcArmor = () => {
        return 0;
    }
}
