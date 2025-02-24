"use strict";
const socket = io({
    auth: {
        serverOffset: 0
    }
});
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const toggleButton = document.getElementById('toggle-btn');
const modal = document.getElementById("nameModal");
const closeBtn = document.getElementsByClassName("close")[0];
const submitNameBtn = document.getElementById("submitName");
const usernameInput = document.getElementById("username");
//Disconnect button
toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (socket.connected) {
        toggleButton.innerText = 'Connect';
        socket.disconnect();
    }
    else {
        toggleButton.innerText = 'Disconnect';
        socket.connect();
    }
});
//Send message button
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});
//li message
socket.on('chat message', (msg, serverOffset) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset;
});
socket.on('connect', () => {
    console.log('Connected to the server!');
});
//Modal username
window.onload = () => {
    modal.style.display = "block";
};
closeBtn.onclick = () => {
    modal.style.display = "none";
};
submitNameBtn.onclick = () => {
    const username = usernameInput.value.trim();
    if (username) {
        alert(`Hola, ${username}!`);
        modal.style.display = "none"; // Cerrar el modal
    }
    else {
        alert("Por favor ingresa un nombre.");
    }
};
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
