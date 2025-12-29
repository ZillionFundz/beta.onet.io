// ...existing code preserved and improved...
const overLay = document.getElementById('overlay');
const sideBar = document.getElementById('side-bar');
overLay.addEventListener('click', () => {
    sideBar.style.display = 'none';
})


/* CTA ripple effect */
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

/* Sidebar helpers */
function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'flex';
}
function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'none';
}

/* Initialize main Swiper (explorer) if element exists */
if (typeof Swiper !== 'undefined') {
    try {
        const explorerSwiper = new Swiper('.wrapper', {
            slidesPerView: 'auto',
            spaceBetween: 2,
            loop: true,
            pagination: { el: '.swiper-pagination' },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            autoplay: { delay: 5000, disableOnInteraction: false, waitForTransition: true },
            speed: 3500
        });
    } catch (e) {
        console.warn('Explorer Swiper init failed:', e);
    }

    try {
        const testimonialSwiper = new Swiper('.testimonials-swiper', {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
        });
    } catch (e) {
        console.warn('Testimonial Swiper init failed:', e);
    }
}

// ...existing code...

/* =========================
   WALLET (Web3Modal + WalletConnect + ethers)
   ========================= */

/* Initialize wallet connection after scripts load */
window.addEventListener('load', async () => {
    const WC = window.WalletConnectProvider?.default || window.WalletConnectProvider;

    // Configure providers
    const providerOptions = WC ? {
        walletconnect: {
            package: WC,
            options: {
                infuraId: "fdc5d0ef191d4963b3dd39400db6c64a"
            }
        }
    } : {};

    // Initialize Web3Modal
    const web3Modal = new window.Web3Modal.default({
        cacheProvider: true,
        providerOptions,
        disableInjectedProvider: false
    });

    // Connect handler
    // ...existing code...

    async function connect() {
        var msgTxt = document.getElementById('walletAddress');
        try {
            console.log('Opening Web3Modal...');
            const instance = await web3Modal.connect();
            console.log('Provider instance acquired');

            // Initialize provider
            const provider = new window.ethers.providers.Web3Provider(instance);
            console.log('Web3Provider initialized');

            // Request accounts (triggers Trust Wallet popup)
            await provider.send("eth_requestAccounts", []);
            console.log('Account access requested');

            const signer = provider.getSigner();
            const address = await signer.getAddress();
            console.log('Connected address:', address);
            const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');

            // Update UI with connected address
            document.getElementById('walletAddress').textContent =
                `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
            msgTxt.style.color = '#40d483';
            disconnectWalletBtn.classList.remove('hide');

            // Subscribe to events
            instance.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    // var msgTxt = document.getElementById('walletAddress');
                    msgTxt.textContent =
                        `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
                    // msgTxt.style.color = '#28b165ff';
                } else {
                    document.getElementById('walletAddress').textContent = 'Not connected';
                }
            });

        } catch (err) {
            console.log('Connection error:', err);
            // document.getElementById('walletAddress').textContent = 'Connection failed';
            // var msgTxt = document.getElementById('walletAddress');
            msgTxt.textContent = 'Connection failed...!';
            msgTxt.style.color = '#ff4b5c';
        }
    }

    // Bind connect button
    const btn = document.getElementById('connectWalletBtn');
    if (btn) btn.onclick = connect;

    // Auto-connect if previously connected
    if (web3Modal.cachedProvider) connect();



    let disconnectBtn = document.getElementById('disconnect-wallet-btn');
    if (disconnectBtn) disconnectBtn.addEventListener('click', async () => {
        await web3Modal.clearCachedProvider();
        window.location.reload();
    });
});

// ...existing code may continue below ...

