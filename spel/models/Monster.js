export class Monster {
    constructor(name, health, attack, exp, speed = 2, posX, posY, id) {
        this.id = id;

        this.name = name;
        this.health = health;
        this.attack = attack;
        this.exp = exp;
        this.speed = speed;

        this.posX = posX;
        this.posY = posY;
    }
}
