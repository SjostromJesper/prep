expChartArray = [
    100, //2
    200, // 3
    400, //4
    800, //5
    1500, //6
    2600, //7
    4200 //8
];

let currLevel = 4;
let currExp = 400;


let index = currLevel -1;
if(currExp >= expChartArray[index]){
    console.log("you are experienced enough to level up. Ding!");
    console.log("you are now level", index + 2);
} else {console.log("you are level", currLevel)}
