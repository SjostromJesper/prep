import {monsterList} from "./monsterList.js";
import {experienceChart} from "./skillCharts.js";
import {tileMap} from "./map.js";
import {Monster} from "./models/Monster.js";


const monsters = [];
for (let monster in monsterList) monsters.push(monster);

const healthPercent = document.querySelector(".percent");
const healthText = document.querySelector(".health-text");
const experienceText = document.querySelector(".experience-text");
const levelText = document.querySelector(".level-text");

const eventLog = document.querySelector(".event-log");

const healButton = document.querySelector('.heal');
const damageButton = document.querySelector('.damage');


const map = document.querySelector(".map");
const c = map.getContext('2d');

const tileSize = 20;
let x = 0;
let y = 0;

map.setAttribute('width', (tileMap.length * 20).toString());
map.setAttribute('height', (tileMap.length * 20).toString());


const drawMap = () => {
    c.clearRect(0, 0, 600, 600);
    for (let i = 0; i < tileMap.length; i++) {
        for (let j = 0; j < tileMap.length; j++) {
            c.fillStyle = "#000";
            if (tileMap[i][j] === 0) {
                c.fillStyle = "#0F0"
            }
            if (tileMap[i][j] === 3) {
                c.fillStyle = "#F00"
            }

            c.beginPath();
            c.fillRect(j * tileSize, i * (tileSize), tileSize, tileSize);
        }
    }
};

const drawPlayer = () => {

    c.beginPath();
    c.fillStyle = "rgba(111,142,255,0.7)";
    c.fillRect(x, y, tileSize, tileSize);
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
        drawPlayer();
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

const generateNewEnemy = () => {
    const randomPos = Math.floor(Math.random() * tileMap.length);
    if(tileMap[randomPos][randomPos] === 0) {
        tileMap[randomPos][randomPos] = 3;

        console.log("combat tile: ", combatTile);
        console.log(tileMap[combatTile[0]][combatTile[1]]);
        tileMap[combatTile[0]][combatTile[1]] = 0;
        console.log(tileMap[combatTile[0]][combatTile[1]]);
    }
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
        let chosenMonster = monsters[Math.floor(Math.random() * monsters.length)];
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
