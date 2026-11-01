// База из 16 товаров с параметрами isHit (Хиты) и isNew (Новинки)
const products = [
    // --- Nike ---
    { id: 1, name: "Nike Air Force 1", price: 8000, category: 'male', isHit: true, img: "./IMG/eeef.jpg" },
    { id: 2, name: "Nike dunk low", price: 5000, category: 'male', isHit: false, img: "./IMG/item-31137770-f21d-4eba-8e07-592000220c99.jpg" },
    { id: 3, name: "Nike mind", price: 9000, category: 'male', isHit: false, img: "./IMG/vhfh.jpg" },
    { id: 4, name: "Nike Jordan 1", price: 12000, category: 'male', isHit: true, img: "./IMG/1.webp" },

    // --- New balance ---
    { id: 5, name: "New Balance 740v2 White Navy Shadow Grey", price: 7000, category: 'female', isHit: true, img: "./IMG/13494299116.jpg" },
    { id: 6, name: "New Balance 1906R New Spruce", price: 7500, category: 'female', isHit: false, img: "./IMG/2.webp" },
    { id: 7, name: "Aimé Leon Dore x New Balance 1906R Green", price: 6000, category: 'female', isHit: false, img: "./IMG/3.webp" },
    { id: 8, name: "New Balance 530 White Natural Indigo", price: 8000, category: 'female', isHit: true, img: "./IMG/1.webp" },

    // --- Asics ---
    { id: 9, name: "Nite Jogger 7.0", price: 18500, category: 'female', isHit: true, img: "./IMG/13494299116.jpg" },
    { id: 10, name: "Oversize Trench", price: 29000, category: 'female', isHit: false, img: "./IMG/2.webp" },
    { id: 11, name: "Silk Blouse", price: 12000, category: 'female', isHit: false, img: "./IMG/3.webp" },
    { id: 12, name: "Palazzo Pants", price: 15500, category: 'female', isHit: true, img: "./IMG/1.webp" },

    // --- Adidas ---
    { id: 13, name: "Wmns Campus 00s Wonder White", price: 3000, category: 'female', isHit: true, img: "./IMG/13494299116.jpg" },
    { id: 14, name: "Samba OG Black Gum", price: 4000, category: 'female', isHit: false, img: "./IMG/2.webp" },
    { id: 15, name: "Korn x Campus 00s Black Gum", price: 3500, category: 'female', isHit: false, img: "./IMG/3.webp" },
    { id: 16, name: "Palazzo Pants", price: 15500, category: 'female', isHit: true, img: "./IMG/1.webp" },
];

let cart = JSON.parse(localStorage.getItem('vonra_cart')) || [];
let currentSelectedSize = 'M'; 

// Скрытие шапки
let lastScrollTop = 0;
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 80) {
        header.classList.add('hidden'); 
    } else {
        header.classList.remove('hidden'); 
    }
    lastScrollTop = scrollTop;
});

// Анимации
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

function observeElements() {
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Навигация
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(observeElements, 100);
}

function goToCatalog(category) {
    navigate('catalog');
    const buttons = document.querySelectorAll('.catalog-filters .filter-btn');
    buttons.forEach(btn => {
        if ((category === 'male' && btn.innerText === 'Nike') || 
            (category === 'female' && btn.innerText === 'New balance')) {
            filterCatalog(category, btn);
        }
    });
}

function toggleMobileMenu() {
    document.getElementById('mobile-nav').classList.toggle('active');
}

// Рендер обычных сеток
function renderGrid(containerId, filterType = 'all') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    let filtered = products;

    if (filterType === 'hits') {
        filtered = products.filter(p => p.isHit);
    } else if (filterType !== 'all') {
        filtered = products.filter(p => p.category === filterType);
    }

    filtered.forEach(p => {
        container.innerHTML += `
            <div class="product-card fade-in" onclick="openProduct(${p.id})">
                <img src="${p.img}" class="product-img" alt="${p.name}">
                <div class="product-info">
                    <div class="product-title-wrapper">
                        <span class="product-title">${p.name}</span>
                    </div>
                    <span class="product-price">${p.price.toLocaleString()} ₽</span>
                </div>
            </div>
        `;
    });
    observeElements();
}

function filterCatalog(category, btnElement) {
    navigate('catalog');
    document.querySelectorAll('.catalog-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Проверяем, передан ли элемент кнопки
    if (btnElement && btnElement.classList) {
        btnElement.classList.add('active');
    }
    renderGrid('catalog-products', category);
}

// АВТО-ОБНОВЛЕНИЕ НОВИНОК (Каждые 5 секунд)
let newArrivalsOffset = 0;
function rotateNewArrivals() {
    const container = document.getElementById('new-arrivals-products');
    if (!container) return;

    const newItems = products.filter(p => p.isNew || p.isHit);
    if (newItems.length === 0) return;

    let itemsToShow = [];
    for(let i = 0; i < 4; i++) {
        itemsToShow.push(newItems[(newArrivalsOffset + i) % newItems.length]);
    }

    container.style.opacity = 0;
    
    setTimeout(() => {
        container.innerHTML = '';
        itemsToShow.forEach(p => {
            container.innerHTML += `
                <div class="product-card" onclick="openProduct(${p.id})">
                    <img src="${p.img}" class="product-img" alt="${p.name}">
                    <div class="product-info">
                        <div class="product-title-wrapper">
                            <span class="product-title">${p.name}</span>
                        </div>
                        <span class="product-price">${p.price.toLocaleString()} ₽</span>
                    </div>
                </div>
            `;
        });
        container.style.opacity = 1;
        newArrivalsOffset = (newArrivalsOffset + 1) % newItems.length;
    }, 500);
}

// Товар и Корзина
function openProduct(id) {
    const p = products.find(item => item.id === id);
    currentSelectedSize = '40'; 
    
    document.getElementById('product-view-container').innerHTML = `
        <img src="${p.img}" class="product-view-img" alt="${p.name}">
        <div class="product-details">
            <h1>${p.name}</h1>
            <div class="price">${p.price.toLocaleString()} ₽</div>
            
            <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; letter-spacing: 1px;">Выберите размер:</div>
            <div class="size-options">
                <button class="size-btn" onclick="selectSize('39')">39</button>
                <button class="size-btn active" onclick="selectSize('40')">40</button>
                <button class="size-btn" onclick="selectSize('41')">41</button>
                <button class="size-btn" onclick="selectSize('42')">42</button>
                <button class="size-btn" onclick="selectSize('43')">43</button>
                <button class="size-btn" onclick="selectSize('44')">44</button>
                <button class="size-btn" onclick="selectSize('45')">45</button>
                <button class="size-btn" onclick="selectSize('46')">46</button>
            </div>

            <p style="color: #888; font-size: 14px; margin-bottom: 40px; line-height: 1.8;">
                Детально проработанный крой и материалы премиум-класса. Разработано с упором на максимальный комфорт, утилитарную эстетику и строгие линии бренда VONRA.
            </p>
            <button class="btn-primary w-100" onclick="addToCart(${p.id})">Добавить в корзину</button>
        </div>
    `;
    navigate('product');
}

function selectSize(size) {
    currentSelectedSize = size;
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText === size) btn.classList.add('active');
    });
}

function addToCart(id) {
    const p = products.find(item => item.id === id);
    const cartKey = `${id}-${currentSelectedSize}`;
    const existing = cart.find(item => item.cartKey === cartKey);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...p, cartKey: cartKey, size: currentSelectedSize, quantity: 1 });
    }
    
    saveCart();
    const btn = document.querySelector('.product-details .btn-primary');
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = 'Добавлено ✓';
        btn.style.background = '#4CAF50';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = 'var(--text-color)';
        }, 1500);
    }
}

function updateQuantity(cartKey, delta) {
    const item = cart.find(item => item.cartKey === cartKey);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.cartKey !== cartKey);
        }
    }
    saveCart();
}

function saveCart() {
    localStorage.setItem('vonra_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const desktopCounter = document.getElementById('cart-count');
    const mobileCounter = document.getElementById('cart-count-mobile');
    if (desktopCounter) desktopCounter.innerText = count;
    if (mobileCounter) mobileCounter.innerText = count;

    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; margin: 30px 0; font-size: 14px;">Ваша корзина пуста</p>';
        totalEl.innerText = '0 ₽';
        return;
    }

    let total = 0;
    container.innerHTML = '';
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        container.innerHTML += `
            <div class="cart-item">
                <div>
                    <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${item.name}</div>
                    <div style="color: var(--text-muted); font-size: 11px; text-transform: uppercase; margin-bottom: 8px;">Размер: ${item.size}</div>
                    <div style="color: #888; font-size: 13px;">${item.price.toLocaleString()} ₽</div>
                </div>
                <div class="cart-controls">
                    <button onclick="updateQuantity('${item.cartKey}', -1)">−</button>
                    <span style="margin: 0 10px; font-size: 13px; font-weight: 600;">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.cartKey}', 1)">+</button>
                </div>
            </div>
        `;
    });

    totalEl.innerText = `${total.toLocaleString()} ₽`;
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    renderGrid('home-products', 'hits');
    renderGrid('catalog-products', 'all');
    renderCart();
    
    rotateNewArrivals();
    setInterval(rotateNewArrivals, 5000);
    
    observeElements();
});

let isAnimating = false;

function scrollBrands(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const container = document.getElementById('brandScroll');
    if (!container) return;

    const firstItem = container.firstElementChild;
    const lastItem = container.lastElementChild;
    const itemWidth = firstItem.offsetWidth + 15; 

    if (direction === 'right') {
        container.style.transition = 'transform 0.3s ease-in-out';
        container.style.transform = `translateX(-${itemWidth}px)`;

        container.addEventListener('transitionend', function handler() {
            container.style.transition = 'none';
            container.style.transform = 'translateX(0)';
            container.appendChild(firstItem);
            container.removeEventListener('transitionend', handler);
            isAnimating = false;
        });
    } else if (direction === 'left') {
        container.insertBefore(lastItem, firstItem);
        container.style.transition = 'none';
        container.style.transform = `translateX(-${itemWidth}px)`;

        void container.offsetWidth;

        container.style.transition = 'transform 0.3s ease-in-out';
        container.style.transform = 'translateX(0)';

        container.addEventListener('transitionend', function handler() {
            container.style.transition = 'none';
            container.removeEventListener('transitionend', handler);
            isAnimating = false;
        });
    }
}
