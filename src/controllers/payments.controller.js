import { Preference } from "mercadopago"
import { MercadoPagoConfig } from "mercadopago"
import config from "../config/config.js" 

const { mercadoKey, mercadoToken } = config;

export const client = new MercadoPagoConfig({ accessToken: mercadoToken });

export const getPublicKey = async (req, res) => {
	try {
		const publicKey = JSON.stringify(mercadoKey);

		res.status(200).send(publicKey);
	} catch (error) {
		req.logger.fatal("Couldnt get MercadoPago public key");
		res.status(500).json({errorMessage: "Internal Server Error: "+error});
	}
};

export const createOrderMP = async (req, res) => {
	try {
        const { totalAmount } = req.params
		
        const body = {
			items: [
				{
					title: "MundoCan Purchase",
					quantity: 1,
					unit_price: Number(totalAmount),
					currency_id: 'ARS',
				},
			],
			back_urls: {
				success: "http://localhost:8080/products",
				failure: "http://localhost:8080/products",
				pending: "http://localhost:8080/products"
			},
		};

		const preference = new Preference(client);
		const resultPreference = await preference.create({ body });

		res.status(201).json({ id: resultPreference.id });
	} catch (error) {
		req.logger.fatal('It is not possible to create order.');
		res.status(500).json({message:`Internal Server Error: ${error}`});
	}
};