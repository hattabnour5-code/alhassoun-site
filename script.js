const WA_NO = "96171146312";

const orderModal = document.getElementById('orderModal');
const closeOrder = document.getElementById('closeOrder');
const orderForm = document.getElementById('orderForm');
const quickWhatsApp = document.getElementById('quickWhatsApp');

quickWhatsApp.addEventListener('click', (e)=>{
  e.preventDefault();
  orderModal.setAttribute('aria-hidden','false');
});

closeOrder.addEventListener('click', ()=> orderModal.setAttribute('aria-hidden','true'));
orderModal.addEventListener('click', e=> { if(e.target===orderModal) orderModal.setAttribute('aria-hidden','true'); });

orderForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(orderForm);
  const name = fd.get('name') || '';
  const phone = fd.get('phone') || '';
  const location = fd.get('location') || '';
  const order = fd.get('order') || '';
  const msg = `طلب من الموقع\nالاسم: ${name}\nالهاتف: ${phone}\nالموقع: ${location}\nالطلب: ${order}`;
  const waUrl = `https://wa.me/${WA_NO}?text=` + encodeURIComponent(msg);
  window.open(waUrl, '_blank');
  orderModal.setAttribute('aria-hidden','true');
});
