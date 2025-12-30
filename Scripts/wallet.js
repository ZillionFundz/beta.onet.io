import { createWeb3Modal, defaultConfig } from "https://esm.sh/@web3modal/ethers@latest";

const chains = [
    { chainId: 1, name: "Ethereum", rpcUrl: "https://rpc.ankr.com/eth" },
    { chainId: 56, name: "BNB Smart Chain", rpcUrl: "https://bsc-dataseed.binance.org" },
    { chainId: 137, name: "Polygon", rpcUrl: "https://polygon-rpc.com" },
    { chainId: 42161, name: "Arbitrum", rpcUrl: "https://arb1.arbitrum.io/rpc" },
    { chainId: 10, name: "Optimism", rpcUrl: "https://mainnet.optimism.io" }
];

// const projectId = "fdc5d0ef191d4963b3dd39400db6c64a";// old id
const projectId = "f2d9df4b7cef61124048efecabf613c0";

const metadata = {
    name: "ONET",
    description: "Open Network Technology Web3 Portal",
    url: "https://onet.io",
    icons: ["https://onet.io/favicon.ico"]
};

const ethersConfig = defaultConfig({
    metadata,
    enableInjected: true,
    enableWalletConnect: true,
    enableCoinbase: true
});

const modal = createWeb3Modal({
    ethersConfig,
    chains,
    projectId,
    themeMode: "dark" // "dark" | "light" | "system" | "auto"
});

const connectBtn = document.getElementById("connectWalletBtn");
const disconnectBtn = document.getElementById("disconnect-wallet-btn");
const walletText = document.getElementById("walletAddress");

window.connectWallet = async () => {
    try {
        await modal.open();
    } catch (err) {
        console.error('modal.open failed:', err);
        // Show a short user-friendly message and prompt them to check console/network
        try { alert('Wallet connection failed. Check the console for details.'); } catch (e) { /* ignore in non-window env */ }
    }
};

connectBtn?.addEventListener("click", window.connectWallet);

// Log modal events (useful to capture CONNECT_ERROR, DISCONNECT and other events)
if (typeof modal.subscribeEvents === 'function') {
    modal.subscribeEvents((event) => {
        if (event?.type && event.type.toString().includes('ERROR')) {
            console.error('web3modal event (error):', event);
            try { alert(`Wallet error: ${event?.error?.message || event.type}`); } catch (e) { }
        } else {
            console.debug('web3modal event:', event);
        }
    });
} else {
    console.debug('modal.subscribeEvents not available on this modal instance');
}

modal.subscribeState(state => {
    // Debug current state shape for troubleshooting
    console.debug('web3modal state:', state);

    // also try to capture a snapshot from modal if available
    const snapshot = typeof modal.getState === 'function' ? modal.getState() : null;
    if (snapshot) console.debug('web3modal snapshot:', snapshot);

    // candidate keys to search for an address in the state shape
    const candidates = [
        'selectedAccount', 'selectedAddress', 'selectedAccounts',
        'account', 'accounts', 'address', 'userAddress', 'connectedAccount',
        'connected', 'walletAddress'
    ];

    let raw = null;
    for (const key of candidates) {
        if (state && Object.prototype.hasOwnProperty.call(state, key)) { raw = state[key]; break; }
        if (snapshot && Object.prototype.hasOwnProperty.call(snapshot, key)) { raw = snapshot[key]; break; }
    }

    // As a fallback, check nested structures that some adapters use
    if (!raw && state?.wallet?.accounts) raw = state.wallet.accounts;
    if (!raw && snapshot?.wallet?.accounts) raw = snapshot.wallet.accounts;

    let addr = null;
    if (Array.isArray(raw)) addr = raw[0];
    else if (raw && typeof raw === 'object') addr = raw.address || raw[0] || raw?.accounts?.[0] || null;
    else addr = raw;

    console.debug('resolved address:', addr);

    if (addr && typeof addr === 'string' && addr.length > 0) {
        const short = addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
        if (walletText) { walletText.textContent = `Connected: ${short}`; walletText.style.color = "#40d483"; }
        if (disconnectBtn) disconnectBtn.classList.remove("hide");
    } else {
        if (walletText) { walletText.textContent = "Not connected"; walletText.style.color = "#999"; }
        if (disconnectBtn) disconnectBtn.classList.add("hide");
    }
});

disconnectBtn?.addEventListener("click", async () => {
    await modal.disconnect();
});
