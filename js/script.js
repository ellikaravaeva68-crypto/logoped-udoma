// ===== СЕГМЕНТ 1: Initialization & Global Functions =====
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== СЕГМЕНТ 2: DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scrollTop');
    const preloader = document.querySelector('.preloader');

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

            if (mobileBtn && mobileBtn.classList.contains('active')) {
                mobileBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }

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

    // ===== СЕГМЕНТ 9: Form Submission to Telegram =====
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwAkeJZ9nAbpJ1cNARJOzYVBStQeSpIyN3G7u7F9XSsByk14dgoh8e5TqE7waSAM4lm/exec';

    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        const phoneInput = callbackForm.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function (e) {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);

                if (value.length > 0) {
                    if (value.length <= 1) {
                        value = '+7';
                    } else if (value.length <= 4) {
                        value = '+7 (' + value.slice(1, 4);
                    } else if (value.length <= 7) {
                        value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7);
                    } else {
                        value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 9) + '-' + value.slice(9, 11);
                    }
                }
                this.value = value;
            });
        }

        callbackForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const nameInput = this.querySelector('input[type="text"]');
            const phoneInput = this.querySelector('input[type="tel"]');

            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();

            if (!name || !phone) {
                showNotification('Пожалуйста, заполните имя и телефон', 'error');
                return;
            }

            const digitCount = (phone.match(/\d/g) || []).length;
            if (digitCount < 10) {
                showNotification('Пожалуйста, введите корректный номер телефона', 'error');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;

            setTimeout(async () => {
                try {
                    const formData = {
                        name: name,
                        phone: phone,
                        message: 'Заявка с сайта Логопед у дома',
                        source: 'logoped-website'
                    };

                    await fetch(APPS_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });

                    showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
                    this.reset();

                } catch (error) {
                    showNotification('Произошла ошибка. Попробуйте позже или позвоните нам.', 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }, 100);
        });
    }

    function showNotification(message, type = 'success') {
        let container = document.querySelector('.notification-container');

        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

        container.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ===== СЕГМЕНТ 10: Year Auto-update every minute =====
    setInterval(setCurrentYear, 60000);
});

// ===== СЕГМЕНТ 11: Close Mobile Menu on Outside Click =====
document.addEventListener('click', function (event) {
    const navMenu = document.getElementById('navMenu');
    const mobileBtn = document.getElementById('mobileMenuBtn');

    if (navMenu && mobileBtn && navMenu.classList.contains('active') &&
        !navMenu.contains(event.target) && !mobileBtn.contains(event.target)) {
        mobileBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});