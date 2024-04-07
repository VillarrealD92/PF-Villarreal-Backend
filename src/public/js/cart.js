const cartId = document.querySelector(".cartId").value
console.log(cartId);

document.querySelectorAll(".delProdIcon").forEach(icon => {
    icon.onclick = () => {

       document.querySelectorAll(".cartProductId").forEach(prodId => {
        const productId = prodId.value;
        console.log(productId);

        fetch(`/api/carts/${cartId}/products/${productId}`, { method: "delete" })
            .then(response => {
                return response;
            })
            .then(data => {
                console.log(data);
                return document.location.href = `/cart/${cartId}`;
            })
            .catch(error => {
                console.log("Error: " + error);
            });
        });
    }
}); 


const trashIcon = document.querySelector(".trashIcon")
if (trashIcon) {
    trashIcon.onclick = () => {
        
        fetch(`/api/carts/${cartId}`, { method: "delete" })
        .then(response => {return response.json();})
        .then(data => {
            console.log(data);
            document.location.href = `/cart/${cartId}`
        })
        .catch(error => {
            console.log("Error: " + error);
        });
    
    }
    
}

let totalAmount = 0
document.querySelectorAll(".cartProducts").forEach(cartProduct => {
    const price = parseFloat(cartProduct.querySelector(".productPrice").value)
    const quantity = parseInt(cartProduct.querySelector(".productQuantity").value)

    const partialTotal = price * quantity;
    totalAmount+=partialTotal

    cartProduct.querySelector(".totalProductAmount").innerHTML = `Total: $${partialTotal.toFixed(2)}`;
});

const finalAmount = document.querySelector(".finalAmount")
if (finalAmount) {
    finalAmount.innerHTML=`Total: $${totalAmount.toFixed(2)}`
}

// CREA BOTÓN MERCADO PAGO
const createCheckoutButton = async (mp, preferenceId) => {
    try {
        const bricksBuilder = await mp.bricks();
        if (window.checkoutButton) window.checkoutButton.unmount();
        
        await bricksBuilder.create('wallet', 'wallet_container', {
            initialization: {
                preferenceId: preferenceId,
            },
        })
        
    } catch (error) {
        console.log("Error creating MercadoPago checkout button: "+error);
    }
}


const checkout = document.querySelector(".checkOut")
if (checkout) {
    checkout.onclick = () =>{
    
        fetch(`/api/carts/${cartId}/purchase`, { method: "post" })
        .then(response => {return response.json()})
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
                
                fetch("/api/payments/publicKey", {
                    method: "GET"
                })
                .then((response) => {return response.json()})
				.then((data) => {
					const mp = new MercadoPago(data, {
						locale: 'es-AR',
					});
                    fetch(`/api/payments/createorder/${totalAmount}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((response) => {return response.json()})
                    .then((data) => {
                        const preferenceId = data.id;
                        createCheckoutButton(mp, preferenceId)
                    })
                    .catch((error) => console.error("Error: "+error))
    
				})
				.catch((error) =>
					console.error(
						"Error: " + error
					)
				);
                

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