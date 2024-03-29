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

const checkout = document.querySelector(".checkOut");
if (checkout) {
    checkout.onclick = () => {
        fetch(`/api/carts/${cartId}/purchase`, { method: "post" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error purchasing products");
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                showAlert("Purchase successful! Redirecting to profile...", "success");
                setTimeout(() => {
                    document.location.href = "/profile";
                }, 2000);
            })
            .catch(error => {
                console.error("Error: " + error);
                showAlert("Error purchasing products", "error");
            });
    };
}

function showAlert(message, type) {
    Swal.fire({
        title: message,
        icon: type,
        timer: 1000,
        showConfirmButton: false
    });
}

