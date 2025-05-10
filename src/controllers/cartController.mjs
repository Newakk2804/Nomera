import Food from '../models/Foods.mjs';
import Cart from '../models/Carts.mjs';

export const cartView = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ owner: userId }).populate('items.food');

    if (!cart || cart.items.length === 0) {
      return res.json({ success: true, items: [] });
    }

    const formattedItems = cart.items.map((item) => ({
      food: {
        id: item.food._id,
        title: item.food.title,
        price: item.food.price,
        imageUrl: item.food.imageUrl,
      },
      quantity: item.quantity,
    }));

    res.json({ success: true, items: formattedItems, totalPrice: cart.totalPrice });
  } catch (err) {
    console.error('Ошибка при получении содержимого корзины: ', err);
    res.status(500).json({ success: false, message: 'Не удалось загрузить корзину' });
  }
};

export const addDishToCart = async (req, res) => {
  try {
    const foodId = req.params.id;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Пользователь не авторизован' });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Блюдо не найдено' });
    }

    let cart = await Cart.findOne({ owner: userId });

    if (!cart) {
      cart = new Cart({
        owner: userId,
        items: [{ food: foodId, quantity: 1 }],
        totalPrice: food.price,
      });
      await cart.save();
      return res.json({
        success: true,
        message: 'Товар добавлен в корзину',
        quantity: 1,
        totalPrice: cart.totalPrice,
      });
    }

    const itemIndex = cart.items.findIndex((item) => item.food.toString() === foodId);

    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ food: foodId, quantity: 1 });
    }

    cart.totalPrice += food.price;
    await cart.save();

    const updatedItem = cart.items.find((item) => item.food.toString() === foodId);

    res.json({
      success: true,
      message: 'Товар добавлен в корзину',
      quantity: updatedItem.quantity,
      totalPrice: cart.totalPrice,
    });
  } catch (err) {
    console.error('Ошибка при добавлении товара в корзину:', err);
    res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
  }
};

export const decreaseDishToCart = async (req, res) => {
  try {
    const foodId = req.params.id;
    const userId = req.user._id;

    const cart = await Cart.findOne({ owner: userId });
    if (!cart) {
      return res.status(400).json({ success: false, message: 'Корзина пуста' });
    }

    const itemIndex = cart.items.findIndex((item) => item.food.toString() === foodId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Товар не найден в корзине' });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Блюдо не найдено' });
    }

    let quantity = 0;

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
      quantity = cart.items[itemIndex].quantity;
    } else {
      cart.items.splice(itemIndex, 1);
      quantity = 0;
    }

    cart.totalPrice -= food.price;
    await cart.save();

    res.json({
      success: true,
      message: 'Количество товара уменьшено',
      totalPrice: cart.totalPrice,
      quantity,
    });
  } catch (err) {
    console.error('Ошибка при уменьшении количества товара в корзине: ', err);
    res.status(500).json({
      success: false,
      message: 'Ошибка при уменьшении количества товара в корзине',
    });
  }
};

export const increaseDishToCart = async (req, res) => {
  try {
    const foodId = req.params.id;
    const userId = req.user._id;

    const food = await Food.findById(foodId);
    if (!food) {
      console.log('Блюдо не найдено');
      res.status(404).json({ success: false, message: 'Блюдо не найдено' });
    }

    const cart = await Cart.findOne({ owner: userId });
    if (!cart) {
      console.log('Корзина пуста');
      return res.status(400).json({ success: false, message: 'Корзина пуста' });
    }

    const itemIndex = cart.items.findIndex((item) => item.food.toString() === foodId);
    if (itemIndex === -1) {
      console.log('Товар не найден в корзине');
      return res.status(404).json({ success: false, message: 'Товар не найден в корзине' });
    }

    cart.items[itemIndex].quantity += 1;
    cart.totalPrice += food.price;

    await cart.save();

    const updatedItem = cart.items.find((item) => item.food.toString() === foodId);

    res.json({
      success: true,
      message: 'Количество товара увеличено',
      totalPrice: cart.totalPrice,
      quantity: updatedItem.quantity,
    });
  } catch (err) {
    console.error('Ошибка при увеличении количества товара в корзине:', err);
    res.status(500).json({
      success: false,
      message: 'Ошибка при увеличении количества товара в корзине',
    });
  }
};

export const removeDishToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const foodId = req.params.id;

    const cart = await Cart.findOne({ owner: userId }).populate('items.food');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Корзина не найдена' });
    }

    const index = cart.items.findIndex((item) => item.food && item.food._id.toString() === foodId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Товар не найден в корзине' });
    }

    const removedItem = cart.items[index];

    cart.totalPrice -= removedItem.food.price * removedItem.quantity;

    cart.items.splice(index, 1);
    await cart.save();

    res.json({ success: true, message: 'Товар удален из корзины' });
  } catch (err) {
    console.error('Ошибка при удалении товара из корзины: ', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};
