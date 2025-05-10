import Message from '../models/Messages.mjs';

export const main = (req, res) => {
  const locals = {
    title: 'Контакты',
    activePage: 'contact',
  };

  res.render('contact', locals);
};

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
  }

  try {
    const newMessage = new Message({ name, email, content: message });

    await newMessage.save();

    res.status(200).json({ message: 'Сообщение отправлено!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при отправке сообщения' });
  }
};
