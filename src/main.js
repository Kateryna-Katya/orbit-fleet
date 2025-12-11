document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ПРОВЕРКА И ЗАПУСК LENIS ---
    let lenis;
    
    // Проверяем, загрузилась ли библиотека
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        // Функция анимации
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        console.log("Lenis Smooth Scroll: Active");
    } else {
        console.warn("Lenis library not loaded. Using native scroll.");
        // Если библиотеки нет, просто добавляем стиль для плавности CSS
        document.documentElement.style.scrollBehavior = "smooth";
    }

    // --- 2. РЕГИСТРАЦИЯ GSAP (с проверкой) ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- 3. МОБИЛЬНОЕ МЕНЮ ---
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const menuLinks = document.querySelectorAll('.header__link');
    const body = document.body;

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            nav.classList.toggle('is-active');
            
            // Если Lenis работает, останавливаем его, если нет — блокируем body
            const isMenuOpen = nav.classList.contains('is-active');
            
            if (isMenuOpen) {
                if (lenis) lenis.stop();
                body.style.overflow = 'hidden';
            } else {
                if (lenis) lenis.start();
                body.style.overflow = '';
            }
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('is-active');
                nav.classList.remove('is-active');
                body.style.overflow = '';
                if (lenis) lenis.start();
            });
        });
    }

    // --- 4. HEADER AUTO-HIDE (Только если Lenis активен) ---
    const header = document.querySelector('.header');
    let lastScroll = 0;

    if (lenis && header) {
        lenis.on('scroll', ({ scroll }) => {
            if (scroll > lastScroll && scroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScroll = scroll;
        });
    } else {
        // Фоллбэк для обычного скролла
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
        });
    }

    // --- 5. АНИМАЦИИ (HERO) ---
    if (typeof gsap !== 'undefined') {
        // Если подключен SplitType
        if (typeof SplitType !== 'undefined') {
            const typeSplit = new SplitType('.reveal-type', { types: 'lines, words' });
            gsap.from(typeSplit.words, {
                y: '100%',
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: 'power2.out',
                delay: 0.2
            });
        }

        gsap.from('.hero__bottom', {
            y: 20,
            opacity: 0,
            duration: 1,
            delay: 0.8,
            ease: 'power2.out'
        });

        // Анимация секций
        const sections = document.querySelectorAll('.section-padding');
        sections.forEach(section => {
            // Проверка на наличие детей
            if(section.children.length > 0) {
                gsap.from(section.children, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power2.out'
                });
            }
        });
    }

    // --- 6. ФОРМА ---
    const form = document.getElementById('mainForm');
    const captchaLabel = document.getElementById('captcha-math');
    const captchaInput = document.getElementById('captcha');
    const msgBox = document.getElementById('formMessage');

    let num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10);
    
    if (captchaLabel) {
        captchaLabel.textContent = `${num1} + ${num2} = ?`;
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (parseInt(captchaInput.value) !== (num1 + num2)) {
                msgBox.textContent = "Ошибка: неверный результат примера!";
                msgBox.className = "form__message error";
                return;
            }

            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = "Отправка...";
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                msgBox.textContent = "Спасибо! Заявка отправлена.";
                msgBox.className = "form__message success";
                form.reset();
                num1 = Math.floor(Math.random() * 10);
                num2 = Math.floor(Math.random() * 10);
                if(captchaLabel) captchaLabel.textContent = `${num1} + ${num2} = ?`;
            }, 1500);
        });
    }

    // --- 7. COOKIES ---
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');

    if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.style.display = 'flex';
        }, 2000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            if(cookiePopup) cookiePopup.style.display = 'none';
        });
    }

    // Иконки
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});