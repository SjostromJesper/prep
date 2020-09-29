const sendButton = document.querySelector('.send');
const nameInput = document.querySelector('#name');
const textArea = document.querySelector('#text');
const logs = document.querySelector('.logs');

const postIds = [];

sendButton.addEventListener('click', (e) => {
    e.preventDefault();

    const date = document.createElement('p');
    const div = document.createElement('div');
    const name = document.createElement('h2');
    const message = document.createElement('p');
    const timeSince = document.createElement('p');

    div.className = "yo";

    div.appendChild(timeSince);
    div.appendChild(date);
    div.appendChild(name);
    div.appendChild(message);

    const dateSet = Date.now();
    postIds.push(dateSet);
    timeSince.id = dateSet.toString();

    const hour = new Date().getHours();
    const minute = new Date().getMinutes();

    const month = new Date().getMonth();
    const day = new Date().getDay();
    const year = new Date().getFullYear();

    timeSince.innerHTML = "just now";
    date.innerHTML = `${hour}:${minute} ${day}/${month}/${year}`;
    name.innerHTML = nameInput.value;
    message.innerHTML = textArea.value;

    logs.appendChild(div);
    timeStamp();
});

function timeStamp() {
    postIds.forEach(id => {
        let timeMessage = document.getElementById(id);

        let timeChecker = (Date.now() - id) / 1000;

        if(timeChecker < 5) {
            timeMessage.innerHTML = "just now"
        }
        else if(timeChecker < 10) {
            timeMessage.innerHTML = "a few seconds ago"
        }
        else if( timeChecker < 60) {
            timeMessage.innerHTML = "a moment ago"
        }
        else if(timeChecker < 60 * 60) {
            timeMessage.innerHTML = (Math.floor(timeChecker / 60) + " minutes ago");
        }
        else {
            timeMessage.innerHTML = "over an hour ago"
        }
    });
    requestAnimationFrame(timeStamp)
}
