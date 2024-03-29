document.querySelector(".login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    
    try {
        const response = await fetch("/api/session/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error("Error logging in");
        }

        // Si el inicio de sesión es exitoso, redireccionamos al perfil del usuario
        window.location.href = "/products";
    } catch (error) {
        console.error("Error logging in: ", error);
        showAlert("Failed to log in. Please try again.", "error");
    }
});

function showAlert(message, type, duration = 2000) {
    Swal.fire({
        title: message,
        icon: type,
        timer: duration,
        showConfirmButton: false
    });
}