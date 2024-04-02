const cartId = document.querySelector(".cartId").value;

document.querySelectorAll(".delProdIcon").forEach(icon => {
    icon.onclick = () => {
        document.querySelectorAll(".cartProductId").forEach(prodId => {
            const productId = prodId.value;
            fetch(`/api/carts/${cartId}/products/${productId}`, { method: "delete" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error deleting product");
                    }
                    return response;
                })
                .then(() => {
                    showAlert("Product has been removed from cart", "success");
                    document.location.href = `/cart/${cartId}`;
                })
                .catch(error => {
                    console.error("Error: " + error);
                    showAlert("Error removing product from cart", "error");
                });
        });
    };
});

const trashIcon = document.querySelector(".trashIcon");
if (trashIcon) {
    trashIcon.onclick = () => {
        fetch(`/api/carts/${cartId}`, { method: "delete" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error deleting cart");
                }
                return response;
            })
            .then(() => {
                showAlert("All products have been removed from cart", "success", 4000);
                document.location.href = `/cart/${cartId}`;
            })
            .catch(error => {
                console.error("Error: " + error);
                showAlert("Error removing products from cart", "error");
            });
    };
}

let totalAmount = 0
document.querySelectorAll(".cartProducts").forEach(cartProduct => {
    const price = parseFloat(cartProduct.querySelector(".productPrice").value)
    const quantity = parseInt(cartProduct.querySelector(".productQuantity").value)

    const partialTotal = price * quantity;
    totalAmount += partialTotal

    cartProduct.querySelector(".totalProductAmount").innerHTML = `Total: $${partialTotal.toFixed(2)}`;
});

const finalAmount = document.querySelector(".finalAmount")
if (finalAmount) {
    finalAmount.innerHTML = `Total: $${totalAmount.toFixed(2)}`
}


const checkout = document.querySelector(".checkOut")
if (checkout) {
    checkout.onclick = () => {

        fetch(`/api/carts/${cartId}/purchase`, { method: "post" })
            .then(response => { return response.json() })
            .then(data => {
                console.log(data);

                const cartSection = document.getElementById("cart")
                cartSection.classList.add("d-none")

                const ticketSection = document.getElementById("ticket")
                ticketSection.classList.remove("d-none")

                const products = data.result[0].productsToBuy

                const totalAmount = data.result[2].ticket.amount

                const productsTicket = document.getElementById("productsTicket");

                if (products.length > 0) {
                    const fragment = document.createDocumentFragment();
                    products.forEach(product => {
                        const productDiv = document.createElement("div");
                        productDiv.classList.add("product", "border", "border-black", "rounded", "mb-2", "p-2");

                        const productName = document.createElement("h5");
                        productName.textContent = `${product.product.title}`;

                        const productQuantity = document.createElement("p");
                        productQuantity.textContent = `Quantity: ${product.quantity}`;

                        const productPrice = document.createElement("p");
                        productPrice.textContent = `Price: $${product.product.price}`;

                        productDiv.appendChild(productName);
                        productDiv.appendChild(productQuantity);
                        productDiv.appendChild(productPrice);
                        fragment.appendChild(productDiv);
                    });

                    const totalAmountElement = document.createElement("h5")
                    totalAmountElement.textContent = `Total Amount: $${totalAmount}`

                    productsTicket.appendChild(totalAmountElement)
                    productsTicket.appendChild(fragment);
                } else {
                    productsTicket.innerHTML = `<p>No products in the ticket</p>`;
                }

            })
            .catch(error => {
                console.log("Error: " + error);
            });
    }
}


function showAlert(message, type) {
    Swal.fire({
        title: message,
        icon: type,
        timer: 1000,
        showConfirmButton: false
    });
}


