import axios from 'axios';
import config from '../config/config.js';
import { cartService } from '../repositories/index.repositories.js';

const { port, apiPaypal, clientIdPaypal, secretKeyPaypal} = config;

export const createOrder = async (req, res) => {

    const order = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: "100.00"
                }
            },
        ],
        application_context: {
            brand_name: "MundoCan",
            landing_page: "NO_PREFERENCE",
            user_action: "PAY_NOW",
            return_url: `http://localhost:${port}/paypal/capture-order`,
            cancel_url: `http://localhost:${port}/paypal/cancel-order`
        }
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    try {
        const {data: {access_token}} = await axios.post(`${apiPaypal}/v1/oauth2/token`, params, {
            auth: {
                username: clientIdPaypal,
                password: secretKeyPaypal,
            }
        })
        
        const response = await axios.post(`${apiPaypal}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        console.log(response.data);

        // Obtener el enlace de aprobación
        const approvalLink = response.data.links.find(link => link.rel === 'approve');

        // Redirigir al usuario al enlace de aprobación
        if (approvalLink) {
            return res.redirect(approvalLink.href);
        } else {
            throw new Error('No se encontró el enlace de aprobación en la respuesta de PayPal.');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error al crear la orden de pago');
    }
}

export const captureOrder = async (req, res) => {
    const { token } = req.query;

    try {
        const response = await axios.post(`${apiPaypal}/v2/checkout/orders/${token}/capture`, {}, {
            auth: {
                username: clientIdPaypal,
                password: secretKeyPaypal
            }
        });

        console.log(response.data);

        return res.send('payed');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error capturing order');
    }
};

export const cancelPayment = async (req, res) => res.send("cancel orden");

