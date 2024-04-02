document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(searchForm);
        const userEmail = formData.get("email");

        try {
            const response = await fetch(`/api/users/user?email=${userEmail}`, { method: "GET" });
            const userData = await response.json();

            if (!userData.payload) {
                const errorReport = document.createElement("p");
                errorReport.textContent = "No user found with the provided email.";
                errorReport.classList.add("error-message");
                document.getElementById("user-details").innerHTML = "";
                document.getElementById("user-details").appendChild(errorReport);
                return;
            }

            const userDetailsContainer = document.getElementById("user-details");
            userDetailsContainer.innerHTML = "";

            const userRoleParagraph = document.createElement("p");
            userRoleParagraph.textContent = `User Role: ${userData.payload.role}`;
            userRoleParagraph.classList.add("user-role");

            const userNameParagraph = document.createElement("p");
            userNameParagraph.textContent = `Name: ${userData.payload.first_name} ${userData.payload.last_name}`;
            userNameParagraph.classList.add("user-name");

            const userEmailParagraph = document.createElement("p");
            userEmailParagraph.textContent = `Email: ${userData.payload.email}`;
            userEmailParagraph.classList.add("user-email");

            const LastConnectionParagraph = document.createElement("p");
            const lastConnectionDate = new Date(userData.payload.last_connection);
            const currentTime = new Date();
            const timeDiff = Math.abs(currentTime - lastConnectionDate);
            const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));

            if (userData.payload.last_connection && hoursDiff >= 48) {
                const warningIcon = document.createElement("i");
                warningIcon.classList.add("fas", "fa-exclamation-triangle", "warning-icon");
                LastConnectionParagraph.appendChild(warningIcon);
                LastConnectionParagraph.classList.add("LastConnection", "last-connection-over-48-hours");
            
                const formattedLastConnection = lastConnectionDate.toLocaleString();
                LastConnectionParagraph.textContent = `Last Connection: ${formattedLastConnection}`;
            } else {
                const formattedLastConnection = lastConnectionDate.toLocaleString();
                LastConnectionParagraph.textContent = `Last Connection: ${formattedLastConnection}`;
                LastConnectionParagraph.classList.add("LastConnection");
            }


            const userRoleSelect = document.createElement("select");
            userRoleSelect.name = "userRole";
            userRoleSelect.classList.add("form-select", "user-role-select");
            const roles = ["User", "Premium", "Admin"];
            roles.forEach(role => {
                const option = document.createElement("option");
                option.textContent = role;
                userRoleSelect.appendChild(option);
            });

            const changeRoleButton = document.createElement("button");
            changeRoleButton.type = "submit";
            changeRoleButton.classList.add("btn", "btn-primary", "change-role-btn");
            changeRoleButton.innerHTML = '<i class="fas fa-edit"></i> Change Role';

            const deleteUserButton = document.createElement("button");
            deleteUserButton.type = "button";
            deleteUserButton.classList.add("btn", "btn-danger", "delete-user-btn");
            deleteUserButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete User';

            userDetailsContainer.appendChild(userRoleParagraph);
            userDetailsContainer.appendChild(userNameParagraph);
            userDetailsContainer.appendChild(userEmailParagraph);
            userDetailsContainer.appendChild(LastConnectionParagraph)
            userDetailsContainer.appendChild(userRoleSelect);
            userDetailsContainer.appendChild(changeRoleButton);
            userDetailsContainer.appendChild(deleteUserButton);

            changeRoleButton.addEventListener("click", async () => {
                const newRole = userRoleSelect.value.toLowerCase();
                const roleUpdateResponse = await fetch(`/api/users/user?email=${userEmail}&role=${newRole}`, { method: "PUT" });
                const roleUpdateData = await roleUpdateResponse.json();
                if (roleUpdateData.status === "success") {
                    userRoleParagraph.textContent = `Updated Role: ${newRole}`;
                    userRoleParagraph.classList.add("updated-role-animation");
                    setTimeout(() => {
                        userRoleParagraph.classList.remove("updated-role-animation");
                    }, 2000);
                }
            });

            deleteUserButton.addEventListener("click", async () => {
                const deleteResponse = await fetch(`/api/users/deleteUser/${userData.payload._id}`, { method: "DELETE" });
                const deleteData = await deleteResponse.json();
                if (deleteData.status === "success") {
                    userDetailsContainer.innerHTML = "";
                    const deletionReport = document.createElement("p");
                    deletionReport.textContent = "User has been deleted.";
                    deletionReport.classList.add("deletion-message");
                    userDetailsContainer.appendChild(deletionReport);
                }
            });

        } catch (error) {
            console.error("Error:", error);
        }
    });

    const showUsersWithDocuments = async () => {
        try {
            const response = await fetch(`/api/users/usersWithDocuments`, { method: "GET" });
            const usersWithDocumentsData = await response.json();

            const usersWithDocumentsContainer = document.getElementById("users-with-documents");
            usersWithDocumentsContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar los nuevos elementos

            if (usersWithDocumentsData.payload && usersWithDocumentsData.payload.length > 0) {
                const usersList = document.createElement("ul");

                usersWithDocumentsData.payload.forEach(user => {
                    const userItem = document.createElement("li");
                    userItem.textContent = `${user.first_name} ${user.last_name} (${user.email})`;
                    usersList.appendChild(userItem);
                });

                usersWithDocumentsContainer.appendChild(usersList);
            } else {
                const noUsersMessage = document.createElement("p");
                noUsersMessage.textContent = "No users with documents found.";
                usersWithDocumentsContainer.appendChild(noUsersMessage);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const premiumRequestsButton = document.createElement("button");
    premiumRequestsButton.textContent = "Solicitudes Premium";
    premiumRequestsButton.classList.add("btn", "btn-primary", "premium-requests-btn");
    premiumRequestsButton.addEventListener("click", showUsersWithDocuments);

    const userSection = document.querySelector(".user-section");
    userSection.appendChild(premiumRequestsButton);
});