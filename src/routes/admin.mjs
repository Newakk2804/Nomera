import { Router } from 'express';
import User from '../models/Users.mjs';
import Order from '../models/Orders.mjs';
import { ensureAuthenticated } from '../middlewares/auth.mjs';

const router = Router();

router.get('/', ensureAuthenticated, (req, res) => {
  const locals = {
    title: 'Личный кабинет',
    activePage: '',
    user: req.user,
  };

  res.render('admin', locals);
});

router.get('/list-orders', ensureAuthenticated, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('owner').populate('courier');
  res.render('partials/admin/orders', { layout: false, orders });
});

router.get('/list-orders/:id', ensureAuthenticated, async (req, res) => {
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
});

router.get('/assign-courier/:orderId', ensureAuthenticated, async (req, res) => {
  try {
    const couriers = await User.find({ role: 'courier' }).select('firstName lastName email');
    const order = await Order.findById(req.params.orderId).select('courier');

    const currentCourierId = order?.courier?.toString() || null;

    res.json({ couriers, currentCourierId });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения курьеров' });
  }
});

router.post('/assign-courier', ensureAuthenticated, async (req, res) => {
  const { orderId, courierId } = req.body;
  try {
    await Order.findByIdAndUpdate(orderId, { courier: courierId, status: 'В пути' });
    res.status(200).json({ message: 'Курьер назначен' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка назначения курьера' });
  }
});

router.post('/unassign-courier', async (req, res) => {
  const { orderId } = req.body;

  try {
    await Order.findByIdAndUpdate(orderId, { $unset: { courier: '', status: 'Принят' } });
    res.status(200).json({ message: 'Курьер удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка удаления курьера' });
  }
});

router.post('/update-order-status', async (req, res) => {
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
});

router.get('/list-courier', ensureAuthenticated, async (req, res) => {
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
});

router.get('/courier-orders/:courierId', ensureAuthenticated, async (req, res) =>{
  try {
    const {courierId} = req.params;
    const orders = await Order.find({courier: courierId}).populate('owner').sort({createdAt: -1});

    res.json({orders});
  } catch (error) {
    console.error('Ошибка при получении заказов курьера: ', error);
    res.status(500).json({message: 'Ошибка сервера'});
  }
})

export default router;
