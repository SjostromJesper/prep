/**
 * TODO
 * worldupdate
 * start-formulär för spelare
 * autogenerate randomized map
 */

import {monsterList, monstersToArray} from "./monsterList.js";
import {experienceChart, expChartArray} from "./skillCharts.js";
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
const logger = document.querySelector('.logger');

logger.addEventListener('click', event => {
    console.log(entities[0]);
});




const map = document.querySelector(".map");
const c = map.getContext('2d');

const tileSize = 40;
let x = 0;
let y = 0;

const entities = [];


const getSavedPlayer = (playerName) => {

    if(typeof window.localStorage.getItem(playerName) == "string") {
        console.log("here");
        let p =  JSON.parse(window.localStorage.getItem("Beppe"));
        entities.push(new Player(p.id, p.level, p.name, p.experience, p.speed, p.weapon));
    }
    else {
        console.log("or here");
        entities.push(new Player(1, 1, "Beppe", 0, 10, "axe"));
    }

};
getSavedPlayer("Beppe");



const generateMap = () => {
    const mapSize = 17;
    const generatedMap = [];
    for (let y = 0; y < mapSize; y++) {
        generatedMap.push([]);
        for (let x = 0; x < mapSize; x++) {
            let chance = (Math.floor(Math.random() * 100));
            if (chance < 85) {
                generatedMap[y].push(0)
            } else {
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
            c.fillStyle = "#288a2e";
            if (tileMap[i][j] === 1) {
                c.fillStyle = "#000"
            }

            c.beginPath();
            c.fillRect(j * tileSize, i * (tileSize), tileSize, tileSize);
        }
    }
};

const drawEntities = () => {

    entities.forEach(entity => {
        if (entity.id === 5) {
            const image = document.querySelector("#" + entity.name);
            c.drawImage(image, entity.posX * 40, entity.posY * 40, tileSize, tileSize);
        } else if (entity.id === 1) {
            const playerImage = document.querySelector("#player");
            c.drawImage(playerImage, x, y, tileSize, tileSize);
        }

        entities.forEach(entity => {
            if (entity.id !== 1 && entity.posX * 40 === x && entity.posY * 40 === y && !inCombat) {
                console.log("combat!");

                monster = entity;
                enterCombat();
            }
        })
    });
};

const updateStats = () => {
    if (currentHealth < 0) {
        currentHealth = 0;
        window.localStorage.clear();
    }
    else {

        healthPercent.style.width = currentHealth + "%";
        healthText.innerHTML = currentHealth.toString();
        experienceText.innerHTML = entities[0].experience.toString();
        levelText.innerHTML = entities[0].level.toString();


    }
};

const update = () => {

    drawMap();
    drawEntities();
    updateStats();

    const fps = 15;

    setTimeout(() => {
        requestAnimationFrame(update)

    }, 1000 / fps);

};

let alive = true;
let maxHealth = entities[0].maxHealth;
let currentHealth = entities[0].currentHealth;

let move = 0;

let numOfHeals = 0;

let inCombat = false;

const baseDamage = 5;

const knife = 3;
const sword = 6;
const axe = 7;
const greatAxe = 12;

const greatSmithHammer = {
    grip: "1h",
    attack: 15,
    health: 20,
    dexterity: 3,
    fireDamage: 4,
    selfBurn: 4,
    extra: "can only be wielded while unarmed on offhand"
};


healButton.addEventListener("click", event => {
    if (currentHealth < maxHealth) {
        if(numOfHeals > 0) {
            let amount = Math.floor(Math.random() * 20);
            logEvent("healing for: ", amount);
            currentHealth += amount;
            numOfHeals--;
        }
    }
    if (currentHealth > maxHealth) {
        currentHealth = maxHealth;
    }
});

damageButton.addEventListener('click', event => {
    if (monster !== null && alive) {
        if (monster.health > 0) {
            let amount = Math.floor((Math.random() * baseDamage)) + axe;
            logEvent("you attack the fiend for: " + amount + " damage.");
            monster.health -= amount;
            if (monster.health <= 0) {
                logEvent("you killed the foul fiend!(" + monster.exp + " exp)");
                //entities[0].experience += monster.exp;
                let levelUp = entities[0].gainExp(monster.exp, expChartArray);
                if(levelUp) {
                    maxHealth += 15;
                    currentHealth = maxHealth;
                }

                for (let key in experienceChart) {
                    if (entities[0] > experienceChart[key]) {
                        levelText.innerHTML = key
                    }
                }


                for(let i = 0 ; i < entities.length ; i++) {
                    if(entities[i].uniqueId === monster.uniqueId) {
                        entities.splice(i, 1);
                    }
                }

                numOfHeals++;
                monster = null;
                inCombat = false;
                return;
            }
        }

        if (currentHealth > 0 && monster.health > 0) {
            let amount = Math.floor((Math.random() * baseDamage)) + monster.attack;
            logEvent("the fiend hits you for " + amount + " damage");
            currentHealth -= amount;
            if (currentHealth <= 0) {
                alive = false;
                logEvent("you died!");
                window.localStorage.clear();
            }
        }
    }
});

fleeButton.addEventListener("click", () => {
    generateNewEnemy();
});

const generateNewEnemy = () => {
    let arr = [];

    let foundPos = false;
    while (!foundPos) {
        const randomPosX = Math.floor(Math.random() * tileMap.length);
        const randomPosY = Math.floor(Math.random() * tileMap.length);
        if (tileMap[randomPosX][randomPosY] === 0) {
            arr[0] = randomPosX;
            arr[1] = randomPosY;

            const m = monsterList[monstersToArray()[Math.floor(Math.random() * monstersToArray().length)]];
            entities.push(new Monster(m.name, m.health, m.attack, m.exp, 2, arr[1], arr[0],  Math.floor(Math.random() * 1000)),5);
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
let combatTile = [];

const announcePos = (combat) => {
    let currentTile = tileMap[posY][posX];
    move++;
    worldMovement();
    if (combat) {
        let chosenMonster = monstersToArray()[Math.floor(Math.random() * monstersToArray().length)];
        combatTile = [posX, posY];
        logEvent("oh my god. it's a " + chosenMonster + "!");
        inCombat = true;
    }
};

const enterCombat = () => {
    let chosenMonster = monstersToArray()[Math.floor(Math.random() * monstersToArray().length)];
    combatTile = [posX, posY];

    logEvent("oh my god. it's a " + monster.name + "!");
    inCombat = true;
};

addEventListener("keydown", event => {
    if (!alive) {
        console.log("you're dead.")
    } else if (inCombat && alive) {
        logEvent(`you're in combat. you cannot move until you've killed the ${monster.name}.`);
    } else {
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
        window.localStorage.setItem(entities[0].name, JSON.stringify(entities[0]));
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


const worldMovement = () => {
    if(move > 5) {
        generateNewEnemy();
        move = 0;
    }
};
