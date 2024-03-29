console.log("Ready to chat");

const socket = io();
const user = prompt("User Name");

const input = document.querySelector("#chatInput");
const inputError = document.querySelector("#inputError");
const chatBox = document.querySelector("#chatbox");

function sendMessage(message) {
    if (message.trim().length > 0) {
        socket.emit("message", { user, message });
        input.value = "";
        inputError.innerHTML = "";
    } else {
        inputError.innerHTML = "Cannot send empty messages";
    }
}

input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        sendMessage(e.currentTarget.value);
    }
});

socket.on("logs", (data) => {
    console.log(data);
    let cont = "";
    data.reverse().forEach((message) => {
        cont += `<p><strong><i>${message.user}</i></strong>: ${message.message}</p>`;
    });
    chatBox.innerHTML = cont;
    chatBox.scrollTo(0, chatBox.scrollHeight);
});

const emojiButton = document.getElementById("emojiButton");
const themeSwitch = document.getElementById("themeSwitch");


themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
        document.body.style.backgroundColor = "#222";
        main.style.backgroundColor = "#333";
        main.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.1)";
        main.style.padding = "30px";
    } else {
        document.body.style.backgroundColor = "#f0f0f0";
        main.style.backgroundColor = "#fff";
        main.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
        main.style.padding = "20px";
    }
});

