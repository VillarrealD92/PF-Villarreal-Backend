const userId = document.getElementById("userId").value;
const userRole = document.getElementById("userRole").value;

const socket = io();
socket.on("products", (products) => {
    let table = document.getElementById("tableBody");
    table.innerHTML = "";
    if (products.length > 0 && products) {
        products.forEach(p => {
            table.innerHTML += `
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
            `;
        });
    }
});

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.querySelector("#title").value.trim();
    const category = document.querySelector("#category").value.trim();
    const description = document.querySelector("#description").value.trim();
    const price = Number(document.querySelector("#price").value.trim());
    const code = document.querySelector("#code").value.trim();
    const stock = Number(document.querySelector("#stock").value.trim());

    if (title === "" || category === "" || description === "" || isNaN(price) || code === "" || isNaN(stock)) {
        Swal.fire({
            icon: 'error',
            text: 'Please fill in all fields with valid values',
            showConfirmButton: false,
            timer: 3000
        });
        return;
    }

    const product = {
        title: title,
        category: category,
        description: description,
        price: price,
        code: code,
        stock: stock
    };
    socket.emit("newProduct", product);

    Swal.fire({
        icon: 'success',
        text: 'New product has been created',
        showConfirmButton: false,
        timer: 3000
    });

    console.log("product has been sent");

    document.querySelector("#title").value = "";
    document.querySelector("#category").value = "";
    document.querySelector("#description").value = "";
    document.querySelector("#price").value = "";
    document.querySelector("#code").value = "";
    document.querySelector("#stock").value = "";
});

const deleteForm = document.getElementById("deleteProduct");
deleteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (userRole !== 'admin') {
        Swal.fire({
            icon: "error",
            text: "Solo los administradores pueden eliminar productos",
            showConfirmButton: false,
            timer: 3000,
        });
        return;
    }

    const productId = document.querySelector("#productId").value;

    if (!productId.trim()) {
        Swal.fire({
            icon: "error",
            text: "El campo no puede estar vacío",
            showConfirmButton: false,
            timer: 3000,
        });
        return; 
    }

    try {
        
        const response = await fetch(`/api/products/${productId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            socket.emit("deleteProduct", productId);
            
            Swal.fire({
                icon: "success",
                text: "Producto eliminado",
                showConfirmButton: false,
                timer: 3000,
            });

            
            document.querySelector("#productId").value = "";

        } else {
            
            console.error("Error al eliminar producto:", response.statusText);
            
        }
    } catch (error) {
        console.error("Error:", error);
    }
});