const servicePrices = {
    basic: 1000,
    standard: 2000,
    premium: 3500
};

const serviceNames = {
    basic: "Базовая услуга",
    standard: "Стандартная услуга",
    premium: "Премиум услуга"
};

const optionNames = {
    '0': 'Без опции',
    '500': 'Приоритетная обработка',
    '800': 'Срочное выполнение'
};

const quantityInput = document.getElementById('quantity');
const optionGroup = document.getElementById('optionGroup');
const propertyGroup = document.getElementById('propertyGroup');
const optionSelect = document.getElementById('option');
const propertyCheckbox = document.getElementById('property');
const hourPriceElement = document.getElementById('hourPrice');
const totalPriceElement = document.getElementById('totalPrice');
const summaryType = document.getElementById('summary-type');
const summaryQuantity = document.getElementById('summary-quantity');
const summaryOption = document.getElementById('summary-option');
const summaryOptionText = document.getElementById('summary-option-text');
const summaryProperty = document.getElementById('summary-property');
const summaryPropertyText = document.getElementById('summary-property-text');

let currentServiceType = 'basic';

function init() {
    updateServiceType();
    updatePrice();
    
    document.querySelectorAll('input[name="serviceType"]').forEach(radio => {
        radio.addEventListener('change', updateServiceType);
    });
    
    optionSelect.addEventListener('change', updatePrice);
    propertyCheckbox.addEventListener('change', updatePrice);
    quantityInput.addEventListener('input', updatePrice);
}

function changeQuantity(delta) {
    let value = parseInt(quantityInput.value) + delta;
    if (value < 1) value = 1;
    quantityInput.value = value;
    updatePrice();
}

function updateServiceType() {
    const selectedRadio = document.querySelector('input[name="serviceType"]:checked');
    currentServiceType = selectedRadio.value;
    
    if (currentServiceType === 'basic') {
        optionGroup.style.display = 'none';
        propertyGroup.style.display = 'none';
        summaryOption.style.display = 'none';
        summaryProperty.style.display = 'none';
    } else if (currentServiceType === 'standard') {
        optionGroup.style.display = 'flex';
        propertyGroup.style.display = 'none';
        summaryOption.style.display = 'flex';
        summaryProperty.style.display = 'none';
    } else if (currentServiceType === 'premium') {
        optionGroup.style.display = 'none';
        propertyGroup.style.display = 'flex';
        summaryOption.style.display = 'none';
        summaryProperty.style.display = 'flex';
    }
    
    updatePrice();
}

function updatePrice() {
    const quantity = parseInt(quantityInput.value) || 1;
    
    let hourPrice = servicePrices[currentServiceType];
    
    let optionPrice = 0;
    if (currentServiceType === 'standard') {
        optionPrice = parseInt(optionSelect.value) || 0;
    }
    
    let finalHourPrice = hourPrice + optionPrice;
    
    if (currentServiceType === 'premium' && propertyCheckbox.checked) {
        finalHourPrice = finalHourPrice * 1.15; // +15%
    }
    
    const totalPrice = finalHourPrice * quantity;
    
    hourPriceElement.textContent = Math.round(finalHourPrice) + ' ₽';
    totalPriceElement.textContent = Math.round(totalPrice) + ' ₽';
    
    updateSummary(quantity, hourPrice, optionPrice);
}


function updateSummary(quantity, baseHourPrice, optionPrice) {
    summaryType.textContent = serviceNames[currentServiceType];
    summaryQuantity.textContent = quantity;
    
    if (currentServiceType === 'standard') {
        summaryOptionText.textContent = optionNames[optionPrice.toString()] || optionNames['0'];
    }
    
    if (currentServiceType === 'premium') {
        summaryPropertyText.textContent = propertyCheckbox.checked ? 'Да (+15%)' : 'Нет';
    }
}


document.addEventListener('DOMContentLoaded', init);