
const cartIcon = document.getElementById("cartIcon")
if (cartIcon) {
    cartIcon.onclick = () => {
        const mainCartId = document.getElementById("mainCartId").value
        console.log(mainCartId);

        if (!mainCartId) { return console.log("No cartId is available.") }

        document.location.href = `/cart/${mainCartId}`
    }
}

const userRoleElement = document.getElementById("userRole")
if (userRoleElement) {
    const userRoleValue = userRoleElement.value
    const realTimeBtn = document.getElementById("RTProductsBTN")

    if (userRoleValue == "admin" || userRoleValue == "premium") {
        realTimeBtn.classList.remove("d-none")
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const userIdInput = document.getElementById("userId");
    const premiumBtn = document.getElementById("premiumBtn");
    const userRole = document.getElementById("userRole");

    // Verificar el rol del usuario y mostrar u ocultar el botón "Hacer Premium"
    if (userRole.value === "user" && premiumBtn) {
        premiumBtn.style.display = "block"; // Mostrar el botón
    } else {
        premiumBtn.style.display = "none"; // Ocultar el botón
    }

    // Agregar evento de clic al botón "Hacer Premium"
    if (premiumBtn) {
        premiumBtn.onclick = async () => {
            // Mostrar SweetAlert con el formulario para cargar los documentos
            const userId = userIdInput.value;
            const { value: formValues } = await Swal.fire({
                title: 'Subir Documentos',
                html:
                    '<label for="document1">Address Proof:</label><input type="file" id="document1" class="swal2-input">' +
                    '<label for="document2">Bank Statement:</label><input type="file" id="document2" class="swal2-input">' +
                    '<label for="document3">Identification:</label><input type="file" id="document3" class="swal2-input">'+
                    '<p>Nota: Los archivos deben nombrarse como se indica.</p>',
                focusConfirm: false,
                preConfirm: () => {
                    return [
                        document.getElementById('document1').files[0],
                        document.getElementById('document2').files[0],
                        document.getElementById('document3').files[0]
                    ];
                }
            });

            // Verificar si se proporcionaron archivos
            if (!formValues || !formValues[0] || !formValues[1] || !formValues[2]) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes subir los tres documentos.'
                });
            }

            // Crear objeto FormData y agregar documentos
            const formData = new FormData();
            formData.append('documents', formValues[0]);
            formData.append('documents', formValues[1]);
            formData.append('documents', formValues[2]);

            try {
                // Enviar documentos al servidor
                const response = await fetch(`/api/users/${userId}/documents`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Error al subir documentos.');
                }

                // Mostrar SweetAlert con el botón para actualizar a premium
                await Swal.fire({
                    title: '¡Documentos subidos!',
                    text: 'Haz clic en el botón para hacerte premium.',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Hacer Premium'
                });

                // Hacer una solicitud para actualizar el usuario a premium
                const premiumResponse = await fetch(`/api/users/${userId}/premium`, {
                    method: 'POST'
                });

                if (!premiumResponse.ok) {
                    throw new Error('Error al actualizar a premium.');
                }

                // Mostrar SweetAlert de éxito
                Swal.fire({
                    title: '¡Felicidades!',
                    text: 'Ahora eres un usuario premium.',
                    icon: 'success'
                });

                // Actualizar la página después de hacer premium
                location.reload();
            } catch (error) {
                // Mostrar SweetAlert de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Ha ocurrido un error.'
                });
            }
        };
    }
});