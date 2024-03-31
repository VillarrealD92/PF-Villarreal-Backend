const userId = document.getElementById("userId").value
const userRole = document.getElementById("userRole").value


const socket = io()
socket.on("products", (products) => { 
        let table = document.getElementsByClassName("tableBody")
        table[0].innerHTML=""
        if (products.length>0 && products) {
            products.forEach(p => {
                table[0].innerHTML+= `
                <tr>
                    <td>${p._id}</td>
                    <td>${p.title}</td>
                    <td>${p.description}</td>
                    <td>${p.code}</td>
                    <td>${p.price}</td>
                    <td>${p.stock}</td>
                    ${p.owner ? `<td class="d-none" id="productOwner">${p.owner}</td>` : ''}
                    <td>${p.category}</td>
                </tr>
                `
            })
        }
})


const form = document.getElementById("form")
form.addEventListener("submit", (e) => {
    e.preventDefault()

    const product = {
        title: document.querySelector("#title").value,
        category: document.querySelector("#category").value,
        description: document.querySelector("#description").value,
        price: Number(document.querySelector("#price").value),
        code: document.querySelector("#code").value,
        stock: Number(document.querySelector("#stock").value)
    }
    socket.emit("newProduct", product)

    const createProductBtn = document.getElementById("createProductBtn")
    const small = document.createElement("small");
    small.textContent = "New product has been created";
    small.classList.add("ms-2")
    createProductBtn.insertAdjacentElement("afterend", small)
    setTimeout(() => {
        small.remove();
    }, 3000)
    console.log("product has been sent");

    document.querySelector("#title").value=""
    document.querySelector("#category").value=""
    document.querySelector("#description").value=""
    document.querySelector("#price").value=""
    document.querySelector("#code").value=""
    document.querySelector("#stock").value=""

})

const deleteForm = document.getElementById("deleteProduct")
deleteForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const productId = document.querySelector("#productId").value
    socket.emit("deleteProduct", productId, userId)
    console.log("product Id number "+productId+ " has been deleted");

    document.querySelector("#productId").value=""
})
   