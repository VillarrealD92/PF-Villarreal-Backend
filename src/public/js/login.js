document.querySelector(".login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log("Datos del formulario:", Object.fromEntries(formData));

    try {
        const response = await fetch("/api/session/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: formData.get("email"),
                password: formData.get("password")
            })
        });

        if (!response.ok) {
            throw new Error("Error logging in");
        }
        
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