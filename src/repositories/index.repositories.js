import MongoCartManager from "../dao/mongo/managers/mongo.cart.manager.js";
import MongoMessagesManager from "../dao/mongo/managers/mongo.messages.manager.js";
import MongoProductManager from "../dao/mongo/managers/mongo.product.manager.js";
import MongoTicketManager from "../dao/mongo/managers/mongo.ticket.manager.js";
import MongoUserManager from "../dao/mongo/managers/mongo.user.manager.js";
import CartRepository from "./cart.repository.js";
import ChatRepository from "./chat.repository.js";
import ProductRepository from "./product.repository.js";
import TicketRepository from "./ticket.repository.js";
import UserRepository from "./user.repository.js";

export const cartService = new CartRepository(new MongoCartManager())
export const chatService = new ChatRepository(new MongoMessagesManager())
export const productService = new ProductRepository(new MongoProductManager())
export const ticketService = new TicketRepository(new MongoTicketManager())
export const userService = new UserRepository(new MongoUserManager())
