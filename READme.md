Descripción general del proyecto MundoCan, que es una página web completa con funcionalidades relacionadas con la venta de productos y la interacción de usuarios. El proyecto utiliza Node.js y Express.js como backend, MongoDB como base de datos, y otras tecnologías para diversas funcionalidades.

Archivos Principales:

app.js: Este archivo es el punto de entrada principal de la aplicación Node.js. Se encarga de inicializar el servidor, configurar middlewares, conectar con la base de datos MongoDB, definir rutas, y gestionar la comunicación en tiempo real a través de WebSockets utilizando Socket.IO. Además, se establece la configuración para la autenticación de usuarios utilizando Passport.js.

controllers: Este directorio contiene varios controladores que manejan las diferentes solicitudes HTTP de la aplicación. Los controladores están divididos en archivos individuales según su funcionalidad, como el controlador de carritos (carts.controller.js), controlador de pagos (payments.controller.js), controlador de productos (product.controller.js), controlador de sesiones (session.controller.js), controlador de usuarios (users.controller.js), etc.



Instrucciones de Uso:

- Clona el repositorio del proyecto desde GitHub.
- Instala las dependencias del proyecto utilizando npm o yarn.
- Configura las variables de entorno necesarias, como la URL de la base de datos MongoDB, claves de acceso a servicios externos, etc.
- Inicia el servidor ejecutando el comando npm start o yarn start.
- Accede a la aplicación a través de un navegador web en la dirección proporcionada por el servidor.

Notas Adicionales:
Asegúrate de tener una base de datos MongoDB en ejecución antes de iniciar la aplicación.
La aplicación utiliza servicios externos como MercadoPago para procesar pagos, por lo que es necesario configurar las claves de acceso correspondientes.
La aplicación ofrece funcionalidades de autenticación de usuarios utilizando Passport.js con estrategias de autenticación local, GitHub y Google. Asegúrate de configurar correctamente las claves de API y las URL de redireccionamiento para las estrategias de autenticación externa.

Este README proporciona una visión general del proyecto MundoCan y cómo configurarlo y ejecutarlo. Para obtener más detalles sobre las rutas disponibles, los modelos de datos utilizados, y otras funcionalidades, consulta la documentación proporcionada en el directorio /apidocumentation o revisa el código fuente de los archivos mencionados.