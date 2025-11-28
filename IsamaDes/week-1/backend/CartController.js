const Cart = require("./Cart");

const addToCArt = async (req, res, next) => {
  try {
    const userId = "1234567890abcdef"; // hardcoded for testing

    const {
      productId,
      productName,
      productQuantity,
      manufactureDate,
      expiryDate,
    } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    cart.items.push({
      productId,
      productName,
      productQuantity,
      manufactureDate,
      expiryDate,
    });

    await cart.save();

    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
};

const getCart = async (req, res, next) => {
  try {
    const userId = "1234567890abcdef"; // hardcoded for testing
    let cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(404).json({
        success: false,
        message: "Cart not found for this user",
      });
    res.status(201).json({
      success: true,
      items: cart.items,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addToCArt, getCart };
