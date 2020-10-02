/**
 * TODO
 * worldupdate
 * start-formulär för spelare
 * autogenerate randomized map
 */

import {monsterList, monstersToArray} from "./monsterList.js";
import {experienceChart} from "./skillCharts.js";
//import {tileMap} from "./map.js";
import {Monster} from "./models/Monster.js";
import {Player} from "./models/Player.js";


const healthPercent = document.querySelector(".percent");
const healthText = document.querySelector(".health-text");
const experienceText = document.querySelector(".experience-text");
const levelText = document.querySelector(".level-text");

const eventLog = document.querySelector(".event-log");

const healButton = document.querySelector('.heal');
const damageButton = document.querySelector('.damage');
const fleeButton = document.querySelector('.flee');


const map = document.querySelector(".map");
const c = map.getContext('2d');

const tileSize = 40;
let x = 0;
let y = 0;

const entities = [];

entities.push(new Player("beppe", 0, 10, "axe"));

const generateMap  = () => {
    const mapSize = 17;
    const generatedMap = [];
    for(let y = 0 ; y < mapSize ; y++) {
        generatedMap.push([]);
        for(let x = 0 ; x < mapSize ; x++) {
            let chance = (Math.floor(Math.random() * 100));
            if(chance < 85) {
                generatedMap[y].push(0)
            }
            else {
                generatedMap[y].push(1)
            }
        }
    }
    return generatedMap;
};

const tileMap = generateMap();

map.setAttribute('width', (tileMap.length * tileSize).toString());
map.setAttribute('height', (tileMap.length * tileSize).toString());




const drawMap = () => {
    c.clearRect(0, 0, 600, 600);
    for (let i = 0; i < tileMap.length; i++) {
        for (let j = 0; j < tileMap.length; j++) {
            c.fillStyle = "#9dff59";
            if (tileMap[i][j] === 1) {
                c.fillStyle = "#000"
            }
            if (tileMap[i][j] === 3) {
                c.fillStyle = "#F00"
            }

            c.beginPath();
            c.fillRect(j * tileSize, i * (tileSize), tileSize, tileSize);
        }
    }
};

const drawEntity = () => {

    entities.forEach(entity => {
        if(entity.id === 1) {
            const playerImage = document.querySelector("#dragon");
            console.log("xy:", x + ":" + y);
            c.drawImage(playerImage, x, y, tileSize, tileSize);
        }
        if(entity.id === 5) {
            //console.log("drawing enemy");
            const dragonImage = document.querySelector("#" + entity.name);
            c.drawImage(dragonImage, entity.posX * 40, entity.posY * 40, tileSize, tileSize);
        }
    });







    // const dragonImage = document.querySelector("#source");
    // c.drawImage(dragonImage, x, y, tileSize, tileSize);
};

const updateStats = () => {
    if (currentHealth < 0) {
        currentHealth = 0;
    }
    healthPercent.style.width = currentHealth + "%";
    healthText.innerHTML = currentHealth.toString();
    experienceText.innerHTML = experience.toString();
};


const update = () => {

        drawMap();
        drawEntity()
        updateStats();


    const fps = 15;

    setTimeout(() => {
            requestAnimationFrame(update)

    }, 1000 / fps);

};
let alive = true;
let maxHealth = 100;
let currentHealth = maxHealth;
let experience = 0;

let inCombat = false;

const baseDamage = 5;

const axe = 7;
const greatAxe = 12;


healButton.addEventListener("click", event => {
    if (currentHealth < maxHealth) {
        let amount = Math.floor(Math.random() * 20);
        console.log("healing for: ", amount);
        currentHealth += amount;
    }
    if (currentHealth > maxHealth) {
        currentHealth = maxHealth;
    }
});

damageButton.addEventListener('click', event => {
    if (monster !== null && alive) {
        if (monster.health > 0) {
            let amount = Math.floor((Math.random() * baseDamage)) + axe;
            logEvent("you attack the fiend for: " + amount);
            monster.health -= amount;
            if (monster.health <= 0) {
                logEvent("you killed the foul fiend!(" + monster.exp + " exp)");
                experience += monster.exp;

                for (let key in experienceChart) {
                    if (experience > experienceChart[key]) {
                        levelText.innerHTML = key
                    }
                }

                inCombat = false;

                // skapa nytt monster på slumpad ruta
                generateNewEnemy()

            }
        }

        if (currentHealth > 0 && monster.health > 0) {
            let amount = Math.floor((Math.random() * baseDamage)) + monster.attack;
            logEvent("the fiend hits you for " + amount + " damage");
            currentHealth -= amount;
            if (currentHealth <= 0) {
                alive = false;
                logEvent("you died!");
            }
        }
    }
});

fleeButton.addEventListener("click", () => {
    console.log("finding pos");
    generateNewEnemy()
});

const generateNewEnemy = () => {
    let arr = [];

    let foundPos = false;
    while(!foundPos) {

        const randomPosX = Math.floor(Math.random() * tileMap.length);
        const randomPosY = Math.floor(Math.random() * tileMap.length);
        if(tileMap[randomPosX][randomPosY] === 0) {
            //tileMap[randomPosX][randomPosY] = 3;

            arr[0] = randomPosX;
            arr[1] = randomPosY;

            const m = monsterList[monstersToArray()[Math.floor(Math.random() * monstersToArray().length)]];
            entities.push(new Monster(m.name, m.health, m.attack, m.exp, 2, arr[0], arr[1], 5));
            console.log("found pos");
            foundPos = true;
        }
    }

    return arr;
};

const logEvent = (text) => {
    const ev = document.createElement("p");
    ev.innerHTML = text;
    eventLog.appendChild(ev);
    eventLog.scrollTop = eventLog.scrollHeight;
};

let posX = 0;
let posY = 0;

const walkX = (direction) => {
    if (direction === 'left') {
        if (posX > 0) {
            if (tileMap[posY][posX - 1] === 1) {
                logEvent("wall");
            } else {
                posX--;
                x -= tileSize;
                announcePos()
            }
        } else {
            logEvent("you're already at the edge of the world: " + posX + posY);
        }
    } else {
        if (posX < tileMap.length - 1) {
            if (tileMap[posY][posX + 1] === 1) {
                logEvent("wall");
            } else {
                posX++;
                x += tileSize;
                announcePos()
            }
        } else {
            logEvent("you're already at the edge of the world: " + posX + posY);
        }
    }
};

const walkY = (direction) => {
    if (direction === 'up') {
        if (posY > 0) {
            if (tileMap[posY - 1][posX] === 1) {
                logEvent("wall");
            } else {
                posY--;
                y -= tileSize;
                announcePos()
            }


        } else {
            logEvent("you're already at the edge of the world: " + posX + posY);
        }
    } else {
        if (posY < tileMap.length - 1) {
            if (tileMap[posY + 1][posX] === 1) {
                logEvent("wall");
            } else {
                posY++;
                y += tileSize;
                announcePos()
            }
        } else {
            logEvent("you're already at the edge of the world: " + posX + posY);
        }
    }
};

let monster = null;

const createMonster = (chosenMonster) => {
    monster = new Monster(
        monsterList[chosenMonster].name,
        monsterList[chosenMonster].health,
        monsterList[chosenMonster].attack,
        monsterList[chosenMonster].exp);
};

let combatTile = [];

const announcePos = () => {
    let currentTile = tileMap[posY][posX];

    if (currentTile === 0) {
        if (monster !== null) {
            monster = null;
        }
    } else if (currentTile === 3) {
        let chosenMonster = monstersToArray()[Math.floor(Math.random() * monstersToArray().length)];
        combatTile = [posX, posY];
        console.log("combat tile: ", combatTile);
        console.log(tileMap[combatTile[0]][combatTile[1]]);
        logEvent("oh my god. it's a " + chosenMonster + "!");
        inCombat = true;
        createMonster(chosenMonster);
    }
};

addEventListener("keydown", event => {
    if(!alive) {
        console.log("you're dead.")
    }
    else if(inCombat && alive){
        logEvent(`you're in combat. you cannot move until you've killed the ${monster.name}.`);
    }
    else {
        if (event.key === "ArrowLeft" || event.key === "a") {
            walkX("left");
        }
        if (event.key === "ArrowRight" || event.key === "d") {
            walkX()
        }
        if (event.key === "ArrowUp" || event.key === "w") {
            walkY("up");
        }
        if (event.key === "ArrowDown" || event.key === "s") {
            walkY("down");
        }
    }

});

requestAnimationFrame(update);


/**
 * TODO
 * world event. when the player has moved a certain amount of tiles the monsters change their position as well
 * depeing on their speed.
 *
 * calculate speed
 * player base speed is 10
 * divide the object's speed with the player speed and round down
 * if a mosnter has a speed of 3, divide playerSpeed with 3 and round it down (10 / 3 = 3.33 ~ 3)(10 / 5 = 2 ~ 2)
 */
let move = 0;

const worldMovement = () => {
    monsters.forEach(monster => {

    })
};




