
const cartIcon = document.getElementById("cartIcon")
if (cartIcon) {
    cartIcon.onclick = () => {
        const mainCartId = document.getElementById("mainCartId").value
    
        if (!mainCartId) { return console.log("No cartId is available.") }

        document.location.href = `/cart/${mainCartId}`
    }
}

const userRoleElement = document.getElementById("userRole")
if (userRoleElement) {
    const userRoleValue = userRoleElement.value
    const realTimeBtn = document.getElementById("RTProductsBTN")
    const usersRoleCrudBtn = document.getElementById("usersRoleCrudBtn")

    if (userRoleValue == "admin" || userRoleValue == "premium") {
        realTimeBtn.classList.remove("d-none")
    }

    if (userRoleValue == "admin"){
        usersRoleCrudBtn.classList.remove("d-none")
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const userIdInput = document.getElementById("userId");
    const premiumBtn = document.getElementById("premiumBtn");
    const userRole = document.getElementById("userRole");
    const userEmail = document.getElementById("userRole");

    if (userRole && userRole.value === "user" && premiumBtn) {
        premiumBtn.style.display = "block"; 
    } else {
        if (premiumBtn) {
            premiumBtn.style.display = "none"; 
        }
    }

    
    if (premiumBtn) {
        premiumBtn.onclick = async () => {
            
            const email = userEmail.value;
            const userId = userIdInput.value;
            const { value: formValues } = await Swal.fire({
                title: 'Subir Documentos',
                html:
                '<div class="swal-form">' +
                '<label for="document1">Address Proof:</label><input type="file" id="document1" class="swal2-input">' +
                '<label for="document2">Bank Statement:</label><input type="file" id="document2" class="swal2-input">' +
                '<label for="document3">Identification:</label><input type="file" id="document3" class="swal2-input">'+
                '<p class="note">Nota: Los archivos deben nombrarse como se indica.</p>' +
                '</div>',
                focusConfirm: false,
                preConfirm: () => {
                    return [
                        document.getElementById('document1').files[0],
                        document.getElementById('document2').files[0],
                        document.getElementById('document3').files[0]
                    ];
                }
            });
            
            if (!formValues || !formValues[0] || !formValues[1] || !formValues[2]) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes subir los tres documentos.'
                });
            }
    
            const formData = new FormData();
            formData.append('documents', formValues[0]);
            formData.append('documents', formValues[1]);
            formData.append('documents', formValues[2]);
    
            try {
                const response = await fetch(`/api/users/${userId}/documents`, {
                    method: 'POST',
                    body: formData
                });
    
                if (!response.ok) {
                    throw new Error('Error al subir documentos.');
                }
    
                await Swal.fire({
                    title: '¡Gracias!',
                    text: 'Sus documentos serán revisados por nuestro equipo. Te notificaremos por email cuando cambie tu estado. ¡Muchas gracias!',
                    icon: 'success'
                });
    
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Ha ocurrido un error.'
                });
            }
        };
    }
});