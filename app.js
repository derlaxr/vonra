// ВАЖНО: Все ID теперь уникальные (от 1 до 16). Никаких дублей.
const products = [
    { id: 1, name: "Nike Air Force 1", price: 8000, brand: 'Nike', isHit: true, img: "./IMG/eeef.jpg" },
    { id: 2, name: "Nike dunk low", price: 5000, brand: 'Nike', isHit: false, img: "./IMG/item-31137770-f21d-4eba-8e07-592000220c99.jpg" },
    { id: 3, name: "Nike mind", price: 9000, brand: 'Nike', isHit: false, img: "./IMG/vhfh.jpg" },
    { id: 4, name: "Nike Jordan 1", price: 12000, brand: 'Jordan', isHit: true, img: "./IMG/1.webp" },

    { id: 5, name: "New Balance 740v2 White Navy Shadow Grey", price: 7000, brand: 'New Balance', isHit: true, img: "./IMG/13494299116.jpg" },
    { id: 6, name: "New Balance 1906R New Spruce", price: 7500, brand: 'New Balance', isHit: false, img: "./IMG/2.webp" },
    { id: 7, name: "Aimé Leon Dore x New Balance 1906R Green", price: 6000, brand: 'New Balance', isHit: false, img: "./IMG/3.webp" },
    { id: 8, name: "New Balance 530 White Natural Indigo", price: 8000, brand: 'New Balance', isHit: true, img: "./IMG/1.webp" },

    { id: 9, name: "Asics Gel-Kayano 14", price: 18500, brand: 'Asics', isHit: true, img: "./IMG/13494299116.jpg" },
    { id: 10, name: "Asics GT-2160", price: 14000, brand: 'Asics', isHit: false, img: "./IMG/2.webp" },
    { id: 11, name: "Asics Gel-NYC", price: 12000, brand: 'Asics', isHit: false, img: "./IMG/3.webp" },
    { id: 12, name: "Asics Novablast 4", price: 15500, brand: 'Asics', isHit: true, img: "./IMG/1.webp" },

    { id: 13, name: "Adidas Wmns Campus 00s Wonder White", price: 3000, brand: 'Adidas', isHit: true, img: "./IMG/13494299116.jpg" },
    { id: 14, name: "Adidas Samba OG Black Gum", price: 4000, brand: 'Adidas', isHit: false, img: "./IMG/2.webp" },
    { id: 15, name: "Adidas Campus 00s Black Gum", price: 3500, brand: 'Adidas', isHit: false, img: "./IMG/3.webp" },
    { id: 16, name: "Adidas Yeezy Boost 350 V2", price: 15500, brand: 'Yeezy', isHit: true, img: "./IMG/1.webp" },
];

let cart = JSON.parse(localStorage.getItem('vonra_cart')) || [];
let currentSelectedSize = '40'; 

// СКРЫТИЕ ШАПКИ ПРИ СКРОЛЛЕ ВНИЗ
let lastScrollTop = 0;
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 80) {
        header.classList.add('hidden'); 
    } else {
        header.classList.remove('hidden'); 
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// НАВИГАЦИЯ (SPA)
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Закрываем мобильное меню при переходе, если оно открыто
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
    }
}

function toggleMobileMenu() {
    document.getElementById('mobile-nav').classList.toggle('active');
}

// ОТРИСОВКА ТОВАРОВ
function renderGrid(containerId, filterBrand = 'all', onlyHits = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    let filtered = products;

    if (onlyHits) {
        filtered = filtered.filter(p => p.isHit);
    }
    if (filterBrand !== 'all') {
        filtered = filtered.filter(p => p.brand === filterBrand);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p style="color: #666;">Товаров не найдено</p>';
        return;
    }

    filtered.forEach(p => {
        // Обертка product-title-wrapper нужна для свайпа длинных названий
        container.innerHTML += `
            <div class="product-card" onclick="openProduct(${p.id})">
                <img src="${p.img}" class="product-img" alt="${p.name}" loading="lazy">
                <div class="product-info">
                    <div class="product-title-wrapper">
                        <span class="product-title">${p.name}</span>
                    </div>
                    <span class="product-price">${p.price.toLocaleString()} ₽</span>
                </div>
            </div>
        `;
    });
}

// ФИЛЬТРАЦИЯ КАТАЛОГА
function filterCatalog(brand, btnElement) {
    navigate('catalog');
    
    // Обновляем активную кнопку
    document.querySelectorAll('.catalog-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (btnElement) btnElement.classList.add('active');
    
    renderGrid('catalog-products', brand);
}

// СТРАНИЦА ТОВАРА
function openProduct(id) {
    const p = products.find(item => item.id === id);
    if (!p) return;
    
    currentSelectedSize = '40'; 
    
    document.getElementById('product-view-container').innerHTML = `
        <img src="${p.img}" class="product-view-img" alt="${p.name}">
        <div class="product-details">
            <h1>${p.name}</h1>
            <div class="price">${p.price.toLocaleString()} ₽</div>
            
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px; letter-spacing: 1px;">ВЫБЕРИТЕ РАЗМЕР:</div>
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

            <p style="color: #888; font-size: 13px; margin-bottom: 30px; line-height: 1.6;">
                Детально проработанный крой и материалы премиум-класса. Разработано с упором на максимальный комфорт и строгие линии бренда VONRA.
            </p>
            <button class="btn-primary" onclick="addToCart(${p.id})">Добавить в корзину</button>
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

// КОРЗИНА
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
    
    // Визуальный отклик на кнопке
    const btn = document.querySelector('.product-details .btn-primary');
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = 'Добавлено ✓';
        btn.style.background = '#4CAF50';
        btn.style.color = '#fff';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = 'var(--text-color)';
            btn.style.color = 'var(--bg-color)';
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
    
    document.getElementById('cart-count').innerText = count;
    document.getElementById('cart-count-mobile').innerText = count;

    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; margin: 20px 0; font-size: 13px;">Ваша корзина пуста</p>';
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
                    <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${item.name}</div>
                    <div style="color: var(--text-muted); font-size: 11px; margin-bottom: 8px;">Размер: ${item.size}</div>
                    <div style="font-size: 13px;">${item.price.toLocaleString()} ₽</div>
                </div>
                <div class="cart-controls">
                    <button onclick="updateQuantity('${item.cartKey}', -1)">−</button>
                    <span style="margin: 0 8px; font-size: 13px; font-weight: 600;">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.cartKey}', 1)">+</button>
                </div>
            </div>
        `;
    });

    totalEl.innerText = `${total.toLocaleString()} ₽`;
}

// КАРУСЕЛЬ БРЕНДОВ (ГЛАВНАЯ)
let isAnimating = false;
function scrollBrands(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const container = document.getElementById('brandScroll');
    if (!container) return;

    const firstItem = container.firstElementChild;
    const lastItem = container.lastElementChild;
    const itemWidth = firstItem.offsetWidth + 10; // 10px это gap

    if (direction === 'right') {
        container.style.transition = 'transform 0.3s ease-in-out';
        container.style.transform = `translateX(-${itemWidth}px)`;

        setTimeout(() => {
            container.style.transition = 'none';
            container.style.transform = 'translateX(0)';
            container.appendChild(firstItem);
            isAnimating = false;
        }, 300);
    } else if (direction === 'left') {
        container.insertBefore(lastItem, firstItem);
        container.style.transition = 'none';
        container.style.transform = `translateX(-${itemWidth}px)`;

        setTimeout(() => {
            container.style.transition = 'transform 0.3s ease-in-out';
            container.style.transform = 'translateX(0)';
            setTimeout(() => { isAnimating = false; }, 300);
        }, 10);
    }
}

// ЗАПУСК ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', () => {
    // Рендерим товары
    renderGrid('home-products', 'all', true); // Только хиты на главной
    renderGrid('catalog-products', 'all'); // Все в каталоге
    renderCart();
});
