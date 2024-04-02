import nodemailer from "nodemailer"
import config from "../config/config.js"

export default class Mail {
    constructor(){
        this.transport = nodemailer.createTransport({
            host: 'smtp.gmail.com', 
            port: 587,
            secure: false, 
            auth: {
                user: config.MAIL_USER,
                pass: config.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    send = async (user, subject, html) => {
        const opt = {
            from: config.MAIL_USER,
            to: user,
            subject,
            html
        };

        try {
            const result = await this.transport.sendMail(opt);
            logger.info(`Email sent to ${user} successfully`);
            return result;
        } catch (error) {
            logger.error(`Error sending email to ${user}: ${error.message}`);
            throw error; 
        }
    };

    sendTicketMail = async (user, ticket, products) => {
        const productList = products.map(product => `
            <li>
                <div style="display: flex;">
                    <img src="${product.thumbnail}" alt="${product.title}" style="width: 100px; height: 100px; margin-right: 20px;">
                    <div>
                        <h4>${product.title}</h4>
                        <p><strong>${product.category}</strong> :${product.description}</p>
                        <p><strong>Price:</strong> $${product.price}</p>
                        <p><strong>Quantity:</strong> ${product.quantity}</p>
                        <p><strong>Code:</strong> ${product.code}</p>
                    </div>
                </div>
            </li>`).join('');
    
        const options = {
            from: "MundoCan",
            to: user,
            subject: "MundoCan - Purchase Ticket",
            html: `<h1>Your purchase has been successful!</h1>
                    <br>
                    <br>
                    <h3>Purchase Ticket: ${ticket}</h3>
                    <br>
                    <h5>Products Purchased:</h5>
                    <ul>
                        ${productList}
                    </ul>
                    <br>
                    <p>Thanks for choosing us!</p>
                    `
        };
    
        const result = await this.transport.sendMail(options);
        return result;
    }

    sendPasswordMail = async (email, url) => {
        const options = {
            from: "MundoCan",
            to: email,
            subject: "MundoCan - RESTABLISH YOUR PASSWORD",
            html: `<h1>Restablish your password</h1>
            <br>
            <br>
            <h3>Click on the following link in order to restablish your password. This link will expire after 1 hour:</h3>
            <br>
            <a href="${url}">Click here</a>
            <br>
            ` 
        }

        const result = await this.transport.sendMail(options)
    }

    sendPremiumRequest = async (email) => {
        const options = {
            from: "MundoCan",
            to: email,
            subject: "MundoCan - Premium Request",
            html: `<h1>¡Casi listo para ser premium en MundoCan!</h1>
            <p>Estimado/a,</p>
            <br>
            <p>Gracias por tu interés en convertirte en usuario premium en MundoCan. Hemos recibido tu solicitud y estamos emocionados de ayudarte a disfrutar de todos los beneficios premium que ofrecemos.</p>
            <br>
            <p>Nuestro equipo está revisando tu solicitud y nos pondremos en contacto contigo pronto para confirmar tu actualización a premium. Mientras tanto, si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con nosotros.</p>
            <br>
            <p>¡Gracias por ser parte de MundoCan!</p>
            <br>
            <p>Atentamente,</p>
            <p>El equipo de MundoCan</p>
            ` 
        }

        const result = await this.transport.sendMail(options)
    }


    sendRoleChangeConfirmation = async (email, role) => {
        const options = {
            from: "MundoCan",
            to: email,
            subject: "MundoCan - Cambio de Rol Confirmado",
            html: `<h1>¡Cambio de Rol Confirmado en MundoCan!</h1>
            <p>Estimado/a,</p>
            <br>
            <p>Te informamos que se ha realizado con éxito el cambio de tu rol en MundoCan. Ahora eres un/a <strong>${role}</strong> en nuestra plataforma.</p>
            <br>
            <p>¡Gracias por confiar en MundoCan!</p>
            <br>
            <p>Atentamente,</p>
            <p>El equipo de MundoCan</p>
            ` 
        }
    
        const result = await this.transport.sendMail(options)
    }

    sendDeletionReport = async (email) => {
        const options = {
            from: config.mailUser,
            to: email,
            subject: "MundoCan - Deleted Account",
            html: `<h1>Account Deleted</h1>
            <br>
            <br>
            <h3> Your account has been deleted due to inactivity.</h3>
            `
        }
    
        const result = await this.transport.sendMail(options)
        return result
    }
}


