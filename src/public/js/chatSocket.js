console.log("Ready to chat");

const socket = io()
const user = prompt("User Name")

const input = document.querySelector("#chatInput")
const inputError = document.querySelector("#inputError")
const chatBox = document.querySelector("#chatbox")

function sendMessage(message) {
    if(message.trim().length > 0) {
        socket.emit("message", { user, message })
        input.value = ""
        inputError.innerHTML = ""
    } else {
        inputError.innerHTML = "Cannot send empty messages"
    }
}

input.addEventListener("keyup", e => {
    if(e.key === "Enter") {sendMessage(e.currentTarget.value)}
})

socket.on("logs", (data) => {
    console.log(data);
    let cont = ""
    data.reverse().forEach(message => {
        cont += `<p> <strong><i>${message.user}</i></strong> : ${message.message}</p>`
    })
    chatBox.innerHTML = cont
})


