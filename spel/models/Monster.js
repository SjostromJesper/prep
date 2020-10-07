export class Monster {
    constructor(name, health, attack, exp, speed = 2, posX, posY, uniqueId, ) {
        this.uniqueId = uniqueId;
        this.id = 5;

        this.name = name;
        this.health = health;
        this.attack = attack;
        this.exp = exp;
        this.speed = speed;

        this.posX = posX;
        this.posY = posY;
    }

    gainExp(lol, lol1) {
        console.log("loling")
    }
}
