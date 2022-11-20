const { Router } = require("express");
const cartRouter = Router();
//const veryfyRole = require("../middlewares/admin");

const Cart = require("../models/cart");
const Container = require("../container/container");

const controller = new Container("cart");
const controllerProd = new Container("products");

cartRouter.post("/", (req, res) => {
    let cart = new Cart();
    res.json(controller.save(cart));
});


cartRouter.delete("/:id", async (req, res) => {
    let { id } = req.params;
    res.json(await controller.deleteById(id));
});

cartRouter.get("/:id/products", async (req, res) => {
    let { id } = req.params;

    let cart = await controller.getById(id);
    console.log(cart.products);
    if (cart.products == undefined) {
        res.json({ response: "No hay productos" });
    } else {
        res.json({ id: cart.id, products: cart.products });
    }

});

cartRouter.post("/:id/products", (req, res) => {
    let { id } = req.params;
    let cart = controller.getById(id);
    let body = req.body.id_prod;

    let products = body.forEach((id_prod) => {
        let prod = controllerProd.getById(id_prod);
        cart.products.push(prod);
    });

    let response = controller.update(cart);
    res.json({ response: "Productos agregados al carrito", cart: response });
});

cartRouter.delete("/:id/products/:id_prod", (req, res) => {
    let { id, id_prod } = req.params;
    let cart = controller.getById(id);

    let index = cart.products.findIndex((el, ind) => {
        if (el.id == id_prod) {
            return true;
        }
    });

    let newProducts = cart.products.filter((prod, ind) => prod.id != id_prod);
    cart.products = newProducts;
    let response = controller.update(cart);
    res.json({ response: "Producto eliminado del carrito", cart: response });
});


module.exports = cartRouter;