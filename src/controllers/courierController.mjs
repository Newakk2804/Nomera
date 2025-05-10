import Order from '../models/Orders.mjs';
import User from '../models/Users.mjs';

export const main = (req, res) => {
  const locals = {
    title: 'Личный кабинет',
    activePage: '',
    user: req.user,
  };

  res.render('courier', locals);
};

export const statisticsDisplay = async (req, res) => {
  try {
    const courierId = req.user._id;
    if (!courierId) {
      return res.status(401).send('Не авторизован');
    }

    const orders = await Order.find({ courier: courierId });

    const total = orders.length;
    const completed = orders.filter((order) => order.status === 'Доставлен').length;
    const canceled = orders.filter((order) => order.status === 'Отменен').length;
    const current = orders.filter(
      (order) =>
        order.status === 'Принят' || order.status === 'Готовится' || order.status === 'В пути'
    ).length;

    const totalEarnings = orders
      .filter((order) => order.status === 'Доставлен')
      .reduce((sum, order) => sum + order.totalPrice, 0);

    res.render('partials/courier/statistics', {
      layout: false,
      stats: { total, completed, canceled, current, totalEarnings },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const currentOrdersCourierDisplay = async (req, res) => {
  try {
    const courierId = req.user._id;
    if (!courierId) {
      return res.status(401).send('Не авторизован');
    }

    const currentOrders = await Order.find({
      courier: courierId,
      status: { $in: ['Принят', 'Готовится', 'В пути'] },
    })
      .populate('courier')
      .populate('owner');

    res.render('partials/courier/current_orders', { layout: false, orders: currentOrders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const currentOrdersDetailDisplay = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('arrayDishes.food');

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const completedOrdersCourierDisplay = async (req, res) => {
  try {
    const courierId = req.user._id;
    if (!courierId) {
      return res.status(401).send('Не авторизован');
    }

    const completedOrders = await Order.find({
      courier: courierId,
      status: 'Доставлен',
    })
      .populate('courier')
      .populate('owner');

    res.render('partials/courier/completed_orders', { layout: false, orders: completedOrders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const canceledOrdersCourierDisplay = async (req, res) => {
  try {
    const courierId = req.user._id;
    if (!courierId) {
      return res.status(401).send('Не авторизован');
    }

    const canceledOrders = await Order.find({
      courier: courierId,
      status: 'Отменен',
    })
      .populate('courier')
      .populate('owner');

    res.render('partials/courier/canceled_orders', { layout: false, orders: canceledOrders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const infoCourierDisplay = (req, res) => {
  res.render('partials/user/info', { layout: false, user: req.user });
};

export const infoCourierUpdate = async (req, res) => {
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
