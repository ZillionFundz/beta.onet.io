

import { loadTradingView } from "./tvwidget.js";

document.addEventListener("DOMContentLoaded", () => {
    loadTradingView("tv-chart");


    // =========================
    // Sidebar
    // =========================
    const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
    const showIds = ['showSidebar', 'show-sidebar'];
    const hideIds = ['hideSidebar', 'hide-sidebar'];

    window.showSidebar = function () {
        const s = document.getElementById('sidebar') || document.querySelector('.sidebar') || sidebar;
        if (!s) {
            console.warn("Sidebar not found in DOM");
            return;
        }
        s.style.display = "flex";
    };

    window.hideSidebar = function () {
        const s = document.getElementById('sidebar') || document.querySelector('.sidebar') || sidebar;
        if (!s) return;
        s.style.display = "none";
    };

    showIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', (e) => {
            e.preventDefault();
            window.showSidebar();
        });
    });

    hideIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', (e) => {
            e.preventDefault();
            window.hideSidebar();
        });
    });

    const overlay = document.getElementById('overlay') || document.querySelector('.overlay');
    if (overlay) overlay.addEventListener('click', window.hideSidebar);


    // =========================
    // Ripple effect
    // =========================
    document.querySelectorAll(".cta-button").forEach(button => {
        button.addEventListener("click", e => {
            const ripple = document.createElement("span");
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = e.clientX - rect.left - size / 2 + "px";
            ripple.style.top = e.clientY - rect.top - size / 2 + "px";
            ripple.classList.add("ripple");

            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });


    // =========================
    // Swipers
    // =========================
    if (window.Swiper) {
        try {
            new Swiper(".wrapper", {
                slidesPerView: "auto",
                spaceBetween: 2,
                loop: true,
                autoplay: { delay: 5000 },
                speed: 3500
            });

            new Swiper(".testimonials-swiper", {
                loop: true,
                autoplay: { delay: 4000 },
                pagination: { el: ".swiper-pagination", clickable: true }
            });
        } catch (e) {
            console.warn("Swiper error:", e);
        }
    }


});

