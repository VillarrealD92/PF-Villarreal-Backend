import config from '../config/config.js';
import mongoose from 'mongoose';
import { programOPTS } from '../utils/commander.js';

export let Products
export let Carts
export let Tickets

const { MONGO_DBNAME, MONGO_URL } = config

switch (programOPTS.p) {
    case 'MONGO':
        try {
            await mongoose.connect(MONGO_URL, { dbName: MONGO_DBNAME });

            const MongoProduct = await importManager('./mongo/managers/mongo.product.manager.js');
            const MongoCart = await importManager('./mongoDB/managers/mongo.cart.manager.js');
            const MongoTicket = await importManager('./mongoDBmanagers/mongo.ticket.manager.js');

            Products = new MongoProduct(); 
            Carts = new MongoCart();
            Tickets = new MongoTicket();
        } catch (error) {
            console.error('Error al inicializar MongoDB:', error);
            
        }
        break;

    case 'FILE':
        try {
            const FileProduct = await importManager('./fsManagers/ProductManager.js');
            const FileCarts = await importManager('./fsManagers/CartsManager.js');

            Products = new FileProduct(); 
            Carts = new FileCarts();
        } catch (error) {
            console.error('Error al inicializar la persistencia de archivos:', error);
            
        }
        break;

    default:
        throw new Error('Persistencia no reconocida');
}