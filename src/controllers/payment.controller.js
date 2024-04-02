import Stripe from 'stripe';
import config from '../config/config.js'; // Suponemos que el token de acceso y la clave secreta están guardados en config

const {  secretKeyPaypal } = config; 

export default class PaymentService {
  constructor(req, res) {
    this.stripe = new Stripe(secretKeyPaypal);
  }

  createPaymentIntent = async(data) => {
    const paymentIntent = this.stripe.paymentIntents.create(data)

    return paymentIntent
  }
    

}



