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
    checkout.onclick = async () => {
        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, { method: "post" });
            if (!response.ok) {
                throw new Error("Error purchasing products");
            }
            const data = await response.json();
            // console.log(data);
            const approvalLink = data.links.find(link => link.rel === 'approve');
            console.log(approvalLink);
            if (!approvalLink) {
              throw new Error("No se encontró el enlace de aprobación de PayPal");
            }
      
            showNotification("Purchase successful! Redirecting to PayPal...", approvalLink.href);
            
          } catch (error) {
            console.error("Error: " + error);
            showAlert("Error purchasing products", "error");
          }
        };
}

function showNotification(message, redirectUrl) {
    Swal.fire({
        title: message,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Go to PayPal',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = redirectUrl;
        }
    });
}


function showAlert(message, type) {
    Swal.fire({
        title: message,
        icon: type,
        timer: 1000,
        showConfirmButton: false
    });
}