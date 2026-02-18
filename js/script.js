// ===== СЕГМЕНТ 1: Initialization & Global Functions =====
// Инициализация AOS (библиотека анимаций)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Функция установки текущего года в футере
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== СЕГМЕНТ 2: DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', function () {
    // Элементы навигации
    const navbar = document.querySelector('.navbar');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scrollTop');
    const preloader = document.querySelector('.preloader');

    // Устанавливаем год
    setCurrentYear();

    // ===== СЕГМЕНТ 3: Preloader =====
    window.addEventListener('load', function () {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // ===== СЕГМЕНТ 4: Navbar Scroll Effect =====
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Кнопка "Наверх"
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    // ===== СЕГМЕНТ 5: Mobile Menu Toggle =====
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // ===== СЕГМЕНТ 6: Close Menu on Link Click =====
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Закрываем мобильное меню
            if (mobileBtn && mobileBtn.classList.contains('active')) {
                mobileBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }

            // Плавный скролл к секции
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== СЕГМЕНТ 7: Scroll to Top Button =====
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== СЕГМЕНТ 8: Active Link Highlighting on Scroll =====
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollPosition = window.scrollY + navbar.offsetHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // ===== СЕГМЕНТ 9: Form Submission (Demo) =====
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }

    // ===== СЕГМЕНТ 10: MAX Links Update (Placeholder) =====
    const maxLinks = document.querySelectorAll('#maxMessengerLink, #navMaxIcon');
    // Раскомментируйте, когда будет готова ссылка:
    // const maxUrl = 'https://ваш- url-для-max.com';
    // maxLinks.forEach(link => {
    //     if (link) link.href = maxUrl;
    // });

    // ===== СЕГМЕНТ 11: Year Auto-update every minute =====
    setInterval(setCurrentYear, 60000);
});

// Предотвращаем всплытие клика по меню, чтобы оно не закрывалось при клике внутри
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navMenu');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (navMenu && mobileBtn && navMenu.classList.contains('active') && 
        !navMenu.contains(event.target) && !mobileBtn.contains(event.target)) {
        mobileBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});