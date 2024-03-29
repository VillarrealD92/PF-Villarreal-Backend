import fs from "fs"

class CartManager{
    constructor (){
        this.path = "./carts.json",
        this.carts = []
    }

    createNewCart = async() => {
        try {
            if (!fs.existsSync(this.path)) {
                this.carts=[]
                const cart = {
                    id: this.carts.length+1,
                    products: []
                }
                this.carts.push(cart)
                console.log(this.carts);
                const carts = JSON.stringify(this.carts)
                await fs.promises.writeFile(this.path, carts)
                return "First cart has been created"
            }

            const cartsJson = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
            this.carts=cartsJson

            const cart = {
                id: this.carts.length+1,
                products: []
            }
            this.carts.push(cart)
            console.log(this.carts);
            const carts = JSON.stringify(this.carts)
            await fs.promises.writeFile(this.path, carts)
            return "New cart has been added"
            
        } catch (error) {
            console.log(error);
            return "Couldnt create new cart"
        }
    }

    getCartByID = async (id) => {
        try {
            const carts = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
            const cartById = carts.find(c => c.id === id)
            if (cartById) {
                return cartById
            }else{undefined}
            
        } catch (error) {
            console.log(error);
            return "Something went wrong while getting Cart by ID"
        }
    }

    productsInCart = async(id) => {
        try {
            const cart = await this.getCartByID(id)
            
            if (cart){
                const productsInCart = cart.products
                console.log(productsInCart);
                return productsInCart
            }else{ return "There is no cart created with that ID number"}

        } catch (error) {
            console.log(error);
            return "Couldnt bring products from cart"
        }
    }

    addProductToCart = async (productId, cartId) => {
        try {
            const cart = await this.getCartByID(cartId)
            
            if (!cart) {return "Wrong Cart ID" }

            const productInCart = cart.products.find(p => p.product === productId)
            
            if (productInCart) {
                productInCart.quantity+=1
                const productIndex = cart.products.findIndex(p => p.product === productId)
                cart.products[productIndex]=productInCart
                
                const carts = JSON.parse(await fs.promises.readFile(this.path,"utf-8"))
                const cartIndex = carts.findIndex(c => c.id === cartId)
                carts[cartIndex]=cart
                this.carts=carts
                await fs.promises.writeFile(this.path,JSON.stringify(this.carts))
                
                return "Product has been added"
            }else{ 
                const productToAdd = {
                    product:productId,
                    quantity:1
                }
                cart.products.push(productToAdd)
                
                const carts = JSON.parse(await fs.promises.readFile(this.path,"utf-8"))
                const cartIndex = carts.findIndex(c => c.id === cartId)
                carts[cartIndex]=cart
                this.carts=carts
                await fs.promises.writeFile(this.path,JSON.stringify(this.carts))
                
                return "Product has been added to cart"
            }

        } catch (error) {
            console.log(error);
            return "Failure"
        }
    }
}

export default CartManager