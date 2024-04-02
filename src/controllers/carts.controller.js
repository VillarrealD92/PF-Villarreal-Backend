import Mail from "../modules/mail.module.js";
import { cartService, productService, ticketService, userService } from "../repositories/index.repositories.js"


export const checkOutProcess = async (req, res) => {
  try {
      const userEmail = req.user.user.email;
      const cartId = req.user.user.cart;
      const cart = await cartService.getPopulatedCart(cartId);

      let totalAmount = 0
      let productsToBuy = []
      let otherProducts = []
      for (const product of cart.products) {
          const productQuantity = product.quantity;
          const productId = product.product;

          const productInDB = await productService.getProductById(productId);

          const productStock = productInDB.stock;
          const productPrice = productInDB.price;

          if (productQuantity <= productStock) {
              const newProductStock = productStock - productQuantity;
              const changes = { stock: newProductStock };
              const updatedProduct = await productService.updateProduct(productId, changes);
              console.log(updatedProduct);

              totalAmount += productQuantity * productPrice;
              productsToBuy.push(product);
          } else {otherProducts.push(product)}
      }

      let ticket;
      if (totalAmount > 0) {
      ticket = await ticketService.createTicket(totalAmount, userEmail);
      } else {
      ticket = "No operation, no ticket";
      }

      const cartUpdated = await cartService.updateCart(cartId, otherProducts);
      console.log(cartUpdated);

      const result = [{productsToBuy}, {otherProducts}, {ticket}];
      console.log({result});

      if (ticket != "No operation, no ticket"){
        const mailer = new Mail
        const ticketCode = ticket.code
        mailer.sendTicketMail(userEmail,ticketCode, productsToBuy)
      }

      res.status(200).send(result);
  } catch (error) { 
      req.logger.error("Error: " + error)
      return res.status(500).send("Internal server error. CheckOutProcess has failed.")
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const cartId = req.user.user.cart;
    const productId = req.params.pid;

    const cart = await cartService.getCartById(cartId);
    const product = await productService.getProductById(productId);

    if (!product) {
      console.log("Wrong Product ID");
      return;
    }

    if (!cart) {
      console.log("Wrong Cart ID");
      return;
    }

    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(productId)
    );
    console.log(productIndex);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      const newProduct = {
        product: productId,
        quantity: 1,
      };
      cart.products.push(newProduct);
    }
    const result = await cart.save();
    console.log(result);
    return res.status(200).json(cart);
  } catch (error) {
    req.logger.error("Error: " + error)
    return res.status(500).send("Internal server error. Something went wrong while adding products to cart.");
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const cartId = req.params.cid.toString();
    console.log(cartId);
    const productId = req.params.pid.toString();
    console.log(productId);

    const cart = await cartService.getCartById(cartId);
    console.log("Cart: " + cart);

    const newProducts = cart.products.filter(
      (product) => product.product != productId
    );
    console.log("New products array: " + newProducts);

    const deletingDocument = await cartService.updateCart(cartId, newProducts);

    return res.status(200).json({status: "success", deletingDocument});
  } catch (error) {
    req.logger.error("Error: " + error)
    return res.status(500).send("Internal server error. Something went wrong while deleting document.");
  }
};

export const emptyCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartService.getCartById(cartId);

    const emptyCart = (cart.products = []);
    const emptyingCart = await cartService.updateCart(cartId, emptyCart);

    console.log(emptyingCart);
    return res.status(200).json({status: "success", emptyingCart});
  } catch (error) {
    req.logger.error("Error: " + error)
    return res.status(500).send("Internal server error. Couldnt empty your cart.");
  }
};

export const createCart = async (req, res) => {
  try {
    const cartCreated = await cartService.createNewCart();
    console.log(JSON.stringify(cartCreated));
    res.status(201).json({status: "success", cartCreated});
  } catch (error) {
    req.logger.error("Error: " + error)
    return res.status(500).send("Internal server error. Something went wrong while creating new cart. Error message.");
  }
};

export const changeProductQuantityInCart = async (req, res) => {
  try {
    const quantityToAdd = parseInt(req.body.quantity);
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartService.getCartById(cartId);

    const productToUpdate = cart.products.find((p) => p.product == productId);

    productToUpdate.quantity += quantityToAdd;
    console.log(productToUpdate);

    console.log(cart);

    const newQuantity = cart.products;

    const updatingCart = await cartService.updateCart(cartId, newQuantity);
    console.log(updatingCart);
    return res.status(200).send("Product quantity has been updated in cart: "+updatingCart);;
  } catch (error) {
    req.logger.error("Error: " + error)
    return res.status(500).send("Internal server error. Couldnt change product quantity");
  }
};

export const insertProductsToCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body;

    const updatedCart = await cartService.updateCart(cartId, newProducts);

    console.log(updatedCart);
    return res.status(200).json({status: "success", updatedCart});
  } catch (error) {
    req.logger.error("Error: " + error)
    return res.status(500).send("Internal server error. Couldnt insert products to cart");
  }
};
