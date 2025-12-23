// script.js
document.addEventListener('DOMContentLoaded', function() {
    // МАССИВ С ИЗОБРАЖЕНИЯМИ - ЗДЕСЬ ВЫ МОЖЕТЕ ВСТАВИТЬ СВОИ ИЗОБРАЖЕНИЯ
    const galleryData = [
        { 
            src: 'Горный пейзаж.png', 
            title: 'Горный пейзаж' 
        },
        { 
            src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', 
            title: 'Лесной путь' 
        },
        { 
            src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop', 
            title: 'Сосновая шишка' 
        },
        { 
            src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop', 
            title: 'Озеро в горах' 
        },
        { 
            src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', 
            title: 'Лесной туман' 
        },
        { 
            src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop', 
            title: 'Дом в лесу' 
        },
        { 
            src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop', 
            title: 'Звездное небо' 
        },
        { 
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 
            title: 'Снежные горы' 
        }
    ];
    
    const totalImages = galleryData.length;
    let currentPage = 0;
    let itemsPerView = 3;
    let totalPages = 0;
    
    // Элементы DOM
    const gallery = document.getElementById('gallery');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pager = document.getElementById('pager');
    
    // Инициализация галереи
    function initGallery() {
        // Очистка галереи
        gallery.innerHTML = '';
        
        // Создание элементов галереи
        galleryData.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.title;
            img.loading = 'lazy';
            
            const title = document.createElement('p');
            title.textContent = item.title;
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(title);
            gallery.appendChild(galleryItem);
        });
        
        // Обновляем количество отображаемых элементов
        updateItemsPerView();
        
        // Инициализация пейджера
        initPager();
        
        // Показываем первую страницу
        updateGallery();
    }
    
    // Определяем количество элементов на странице
    function updateItemsPerView() {
        const isMobile = window.innerWidth <= 768;
        itemsPerView = isMobile ? 1 : 3;
        
        // Обновляем отступы
        const galleryItems = document.querySelectorAll('.gallery-item');
        const gap = 10;
        
        galleryItems.forEach(item => {
            if (isMobile) {
                item.style.flex = `0 0 calc(100% - ${gap}px)`;
            } else {
                item.style.flex = `0 0 calc((100% - ${2 * gap}px) / 3)`;
            }
        });
        
        // Вычисляем общее количество страниц
        totalPages = Math.ceil(totalImages / itemsPerView);
        
        return itemsPerView;
    }
    
    // Инициализация пейджера
    function initPager() {
        pager.innerHTML = '';
        
        // Создаем текст пейджера
        const pagerText = document.createElement('div');
        pagerText.className = 'pager-text';
        pagerText.id = 'pager-text';
        pagerText.textContent = `Страница 1 из ${totalPages}`;
        pager.appendChild(pagerText);
        
        // Создаем точки пейджера
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'pager-dot';
            if (i === 0) dot.classList.add('active');
            dot.dataset.page = i;
            dot.setAttribute('aria-label', `Перейти на страницу ${i + 1}`);
            dot.addEventListener('click', () => goToPage(i));
            pager.appendChild(dot);
        }
    }
    
    // Обновление текста пейджера
    function updatePagerText() {
        const pagerText = document.getElementById('pager-text');
        pagerText.textContent = `Страница ${currentPage + 1} из ${totalPages}`;
    }
    
    // Переход к определенной странице
    function goToPage(pageIndex) {
        // Проверяем границы
        if (pageIndex < 0) pageIndex = 0;
        if (pageIndex >= totalPages) pageIndex = totalPages - 1;
        
        currentPage = pageIndex;
        updateGallery();
    }
    
    // Обновление галереи
    function updateGallery() {
        // Вычисляем смещение для галереи
        const offset = -currentPage * 100;
        gallery.style.transform = `translateX(${offset}%)`;
        
        // Обновляем активную точку в пейджере
        updatePagerDots();
        
        // Обновляем текст пейджера
        updatePagerText();
        
        // Обновляем состояние кнопок
        updateButtons();
    }
    
    // Обновление активной точки в пейджере
    function updatePagerDots() {
        const dots = document.querySelectorAll('.pager-dot');
        dots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Обновление состояния кнопок
    function updateButtons() {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
    }
    
    // Обработчики событий для стрелок
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            goToPage(currentPage - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
        }
    });
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        const oldCurrentPage = currentPage;
        updateItemsPerView();
        
        // Пересчитываем текущую страницу
        const firstVisibleIndex = oldCurrentPage * (itemsPerView === 1 ? 3 : 1);
        currentPage = Math.floor(firstVisibleIndex / itemsPerView);
        
        // Обновляем пейджер
        initPager();
        
        // Переходим на пересчитанную страницу
        updateGallery();
    });
    
    // Инициализация при загрузке
    initGallery();
});