const products = {
    '1500': 'Смартфон',
    '850': 'Наушники',
    '2300': 'Планшет'
};

function changeQuantity(delta) {
    const input = document.getElementById('quantity');
    let value = parseInt(input.value) + delta;
    if (value < 1) value = 1;
    input.value = value;
    updatePrice();
}

function updatePrice() {
    const product = document.getElementById('product');
    const price = product.value;
    document.getElementById('price').textContent = price + ' ₽';
}

function calculate() {
    const product = document.getElementById('product');
    const quantity = document.getElementById('quantity');
    
    const price = parseInt(product.value);
    const qty = parseInt(quantity.value);
    
    if (!price) {
        alert('Выберите товар');
        return;
    }
    
    const total = price * qty;
    
    document.getElementById('result-product').textContent = products[product.value];
    document.getElementById('result-quantity').textContent = qty;
    document.getElementById('result-price').textContent = price + ' ₽';
    document.getElementById('result-total').textContent = total + ' ₽';
    
    document.getElementById('result').style.display = 'block';
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updatePrice();
    
    // Обработчики событий
    document.getElementById('product').addEventListener('change', updatePrice);
    document.getElementById('quantity').addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 1) this.value = 1;
        updatePrice();
    });
});