import Order from '../models/Orders.mjs';
import User from '../models/Users.mjs';
import fs from 'fs';
import path from 'path';
import Category from '../models/Categories.mjs';
import Food from '../models/Foods.mjs';
import Message from '../models/Messages.mjs';

export const main = (req, res) => {
  const locals = {
    title: 'Личный кабинет',
    activePage: '',
    user: req.user,
  };

  res.render('admin', locals);
};

export const profileAdminListOrderDisplay = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('owner').populate('courier');
  res.render('partials/admin/orders', { layout: false, orders });
};

export const profileAdminCurrentOrderDisplay = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('arrayDishes.food');

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    res.json(order);
  } catch (err) {
    console.error('Ошибка при получении заказа: ', err);
    res.status(500).json({ message: 'Ошибка при получении данных заказа' });
  }
};

export const assignCourierCurrentOrderDisplay = async (req, res) => {
  try {
    const couriers = await User.find({ role: 'courier' }).select('firstName lastName email');
    const order = await Order.findById(req.params.orderId).select('courier');

    const currentCourierId = order?.courier?.toString() || null;

    res.json({ couriers, currentCourierId });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения курьеров' });
  }
};

export const assignCourier = async (req, res) => {
  const { orderId, courierId } = req.body;
  try {
    await Order.findByIdAndUpdate(orderId, { courier: courierId, status: 'В пути' });
    res.status(200).json({ message: 'Курьер назначен' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка назначения курьера' });
  }
};

export const unassignCourier = async (req, res) => {
  const { orderId } = req.body;

  try {
    await Order.findByIdAndUpdate(orderId, { $unset: { courier: '', status: 'Принят' } });
    res.status(200).json({ message: 'Курьер удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка удаления курьера' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  if (!['Принят', 'Готовится', 'В пути', 'Доставлен', 'Отменен'].includes(status)) {
    return res.status(400).json({ error: 'Недопустимый статус' });
  }

  try {
    await Order.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ message: 'Статус обновлён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении' });
  }
};

export const listCourierDisplay = async (req, res) => {
  try {
    const couriers = await User.find({ role: 'courier' });
    const couriersIds = couriers.map((courier) => courier._id);
    const orders = await Order.find({ courier: { $in: couriersIds } });

    const courierStats = couriers.map((courier) => {
      const courierOrders = orders.filter(
        (order) => order.courier.toString() === courier._id.toString()
      );

      const completedOrders = courierOrders.filter((order) => order.status === 'Доставлен').length;

      const currentOrders = courierOrders.filter((order) =>
        ['Принят', 'Готовится', 'В пути'].includes(order.status)
      ).length;

      return {
        id: courier._id,
        firstName: courier.firstName,
        lastName: courier.lastName,
        email: courier.email,
        phone: courier.phone,
        completedOrders,
        currentOrders,
      };
    });

    res.render('partials/admin/courier', { layout: false, courierStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при получении курьеров' });
  }
};

export const listOrderCurrentCourier = async (req, res) => {
  try {
    const { courierId } = req.params;
    const orders = await Order.find({ courier: courierId })
      .populate('owner')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Ошибка при получении заказов курьера: ', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const displayInfoAdmin = (req, res) => {
  res.render('partials/user/info', { layout: false, user: req.user });
};

export const infoAdminUpdate = async (req, res) => {
  const { firstName, lastName, phone } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;

    await user.save();

    res.json({ message: 'Данные успешно обновлены', success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера', success: false });
  }
};

export const displayNewDish = async (req, res) => {
  const categories = await Category.find();

  res.render('partials/admin/new_dish', { layout: false, categories });
};

export const newDishAdd = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      weight,
      'nutritionalValue.calories': calories,
      'nutritionalValue.protein': protein,
      'nutritionalValue.fat': fat,
      'nutritionalValue.carbs': carbs,
    } = req.body;

    const imageUrl = `uploads/${req.file.filename}`;
    const newFood = new Food({
      title,
      description,
      category,
      price,
      imageUrl,
      weight,
      nutritionalValue: {
        calories,
        protein,
        fat,
        carbs,
      },
    });

    await newFood.save();
    res.redirect('/admin');
  } catch (err) {
    console.error('Ошибка при добавлении блюда:', err);
    res.status(500).send('Ошибка сервера');
  }
};

export const deleteDishAdmin = async (req, res) => {
  try {
    const dish = await Food.findById(req.params.id);
    if (!dish) return res.status(404).json({ error: 'Блюдо не найдено' });

    if (dish.imageUrl) {
      const imagePath = path.join(process.cwd(), 'public', dish.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Ошибка при удалении изображения: ', err);
      });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

export const messageAdminDisplay = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createAt: -1 });
    res.render('partials/admin/message', { layout: false, messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const editDishDisplay = async (req, res) => {
  try {
    const dish = await Food.findById(req.params.id);
    const categories = await Category.find();
    if (!dish) return res.status(404).send('Блюдо не найдено');
    res.render('edit_dish', {
      dish,
      user: req.user,
      title: 'Редактирование блюда',
      activePage: '',
      categories,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

export const editDish = async (req, res) => {
  try {
    const dish = await Food.findById(req.params.id);

    if (!dish) {
      return res.status(404).send('Блюдо не найдено');
    }

    const { title, description, category, price, weight, nutritionalValue } = req.body;

    dish.title = title;
    dish.description = description;
    dish.category = category;
    dish.price = price;
    dish.weight = weight;
    dish.nutritionalValue = {
      calories: nutritionalValue.calories,
      protein: nutritionalValue.protein,
      fat: nutritionalValue.fat,
      carbs: nutritionalValue.carbs,
    };

    if (req.file) {
      const oldImagePath = path.join('public', dish.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      dish.imageUrl = 'uploads/' + req.file.filename;
    }

    await dish.save();

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при обновлении блюда');
  }
};
