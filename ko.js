/*
student

namn - string
like - array
dislike - array
time - string
 */


class Student {
    constructor(name, like, dislike, time) {
        this.name = name;
        this.like = like;
        this.dislike = dislike;
        this.time = time;
    }
}

const students = [];

const dayStudents = [];
const nightStudents = [];
const either = [];


const name = "jesper";
const likes = ["kenny", "niklas"];
const dislikes = ["andreas", "kristoffer"];
const time = "night";

for(let i = 0 ; i < 60; i++) {
    students.push(new Student(name, likes, dislikes, time));
}

const groups = [];

const numOfPeoplePerGroup = 5;

let numberOfGroups = students.length / numOfPeoplePerGroup;


for(let i = 0 ; i < numberOfGroups ; i++) {
    groups.push([]);
}

let j = 0;
for(let i = 0 ; i < students.length ; i++) {
    let r = Math.round(Math.random() * students.length);

    let student = students.splice(i, 1);

    if(j < groups.length) {
        groups[j].push(student);
        j++;
    }
    else {
        j = 0;
    }

}


groups.forEach(group => {
    console.log(group.length)
})

console.log(students.length);
