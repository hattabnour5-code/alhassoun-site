document.addEventListener('DOMContentLoaded', () => {
  const WA_NO = "96181268088";
  const quickWhatsApp = document.getElementById('quickWhatsApp');
  const orderModal = document.getElementById('orderModal');
  const closeOrder = document.getElementById('closeOrder');
  const cancelOrder = document.getElementById('cancelOrder');
  const orderForm = document.getElementById('orderForm');

  // قائمة الطلبات العمومية لكل الصفحات
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  let orderList = document.getElementById('orderList');
  if(!orderList){
    orderList = document.createElement('ul');
    orderList.id = 'orderList';
    orderForm.querySelector('label[for="order"]')?.insertAdjacentElement('afterend', orderList);
  }

  function saveCart(){ localStorage.setItem('cart', JSON.stringify(cart)); }

  quickWhatsApp.addEventListener('click', () => {
    orderModal.setAttribute('aria-hidden', 'false');
    renderCart();
  });

  closeOrder.addEventListener('click', () => orderModal.setAttribute('aria-hidden', 'true'));
  cancelOrder.addEventListener('click', () => orderModal.setAttribute('aria-hidden', 'true'));

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      addCardToCart(card);
    });
  });

  document.querySelectorAll('.zaatar-btn, .size-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      const name = btn.getAttribute('data-name') || card.querySelector('h3').textContent;
      const price = btn.getAttribute('data-price') || '0';
      cart.push({ item: name, price: price, qty: 1 });
      saveCart();
      renderCart();
      orderModal.setAttribute('aria-hidden', 'false');
    });
  });

  function addCardToCart(card){
    let name = card.querySelector('h3').textContent;
    let priceText = card.querySelector('p')?.textContent || '';
    let priceMatch = priceText.match(/(\d+)/);
    let price = priceMatch ? priceMatch[1] : '0';

    const extra = card.querySelector('.extraGreens');
    if(extra && extra.checked){
      price = parseInt(price) + 50;
      name += ' مع خضرة';
    }

    cart.push({ item: name, price: price, qty: 1 });
    saveCart();
    renderCart();
    orderModal.setAttribute('aria-hidden', 'false');
  }

  function renderCart(){
    orderList.innerHTML = '';
    cart.forEach((c, i) => {
      const li = document.createElement('li');
      li.textContent = `${c.item} x${c.qty} = ${c.price} ل.ل`;
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.style.marginLeft = '8px';
      removeBtn.onclick = () => { cart.splice(i, 1); saveCart(); renderCart(); };
      li.appendChild(removeBtn);
      orderList.appendChild(li);
    });
  }

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = orderForm.name.value.trim();
    const phone = orderForm.phone.value.trim();
    const location = orderForm.location.value.trim();
    const note = orderForm.note.value.trim();

    if(cart.length === 0){
      alert('الرجاء إضافة صنف واحد على الأقل.');
      return;
    }

    let orderStr = cart.map(c => `${c.item} x${c.qty} = ${c.price} ل.ل`).join('\n');
    let msg = `طلب من الموقع\nالاسم: ${name}\nالهاتف: ${phone}\nالموقع: ${location}\nالطلب:\n${orderStr}`;
    if(note) msg += `\nملاحظة: ${note}`;

    const waUrl = `https://wa.me/${WA_NO}?text=` + encodeURIComponent(msg);
    window.open(waUrl, '_blank');

    cart = [];
    saveCart();
    orderModal.setAttribute('aria-hidden', 'true');
    orderForm.reset();
    renderCart();
  });

  // تحميل أي طلبات سابقة عند فتح الصفحة
  renderCart();
});








