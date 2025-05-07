import { showToast } from './toast.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let stripe = null;
let cardElement = null;

window.initStripeAddCard = async function (publishableKey) {
  if (!window.Stripe || !publishableKey) {
    console.error('Stripe не загружен или не передан publishableKey');
    return;
  }

  stripe = Stripe(publishableKey);

  document.getElementById('loading').style.display = 'none';
  document.getElementById('card-form').style.display = 'block';

  const elements = stripe.elements();
  cardElement = elements.create('card');
  cardElement.mount('#card-element');

  document.getElementById('card-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!cardElement) {
      showToast('Ошибка: поле для ввода карты не инициализировано.', 'error');
      return;
    }

    try {
      const res = await fetch('/profile/payments/create-setup-intent', {
        method: 'POST',
      });

      const { clientSecret } = await res.json();

      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Карта успешно добавлена', 'success');
        await sleep(1000);
        location.reload();
      }
    } catch (err) {
      console.error(err);
      showToast('Произошла ошибка при добавлении карты', 'error');
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const keyElement = document.getElementById('stripe-key');
  if (keyElement) {
    const publishableKey = keyElement.dataset.key;
    if (publishableKey) {
      window.initStripeAddCard(publishableKey);
    }
  }
});
