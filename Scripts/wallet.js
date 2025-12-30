import { createWeb3Modal, defaultConfig } from "https://esm.sh/@web3modal/ethers@latest";
import { BrowserProvider } from "https://esm.sh/ethers@6";

// ---------------- CHAINS ----------------
const chains = [
    { chainId: 1, name: "Ethereum", rpcUrl: "https://rpc.ankr.com/eth" },
    { chainId: 56, name: "BNB Smart Chain", rpcUrl: "https://bsc-dataseed.binance.org" },
    { chainId: 137, name: "Polygon", rpcUrl: "https://polygon-rpc.com" },
    { chainId: 42161, name: "Arbitrum", rpcUrl: "https://arb1.arbitrum.io/rpc" },
    { chainId: 10, name: "Optimism", rpcUrl: "https://mainnet.optimism.io" }
];

// ---------------- CONFIG ----------------
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
    themeMode: "dark"
});

// ---------------- DOM ----------------
const connectBtn = document.getElementById("connectWalletBtn");
const disconnectBtn = document.getElementById("disconnect-wallet-btn");
const walletText = document.getElementById("walletAddress");

// ---------------- UI HELPERS ----------------
function setDisconnectedUI() {
    if (walletText) {
        walletText.textContent = "Not connected";
        walletText.style.color = "#999";
    }
    disconnectBtn?.classList.add("hide");
}

function setConnectedUI(address) {
    const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
    if (walletText) {
        walletText.textContent = `Connected: ${short}`;
        walletText.style.color = "#40d483";
    }
    disconnectBtn?.classList.remove("hide");
}

// ---------------- CONNECT ----------------
window.connectWallet = async () => {
    try {
        await modal.open();
        // Ensure UI updates after a successful connection
        await syncWalletState();
    } catch (err) {
        console.error("Wallet modal error:", err);
        alert("Wallet connection failed. Check console.");
    }
};

connectBtn?.addEventListener("click", window.connectWallet);

// ---------------- READ WALLET STATE (CORRECT WAY) ----------------
async function syncWalletState() {
    try {
        // The provider might not be immediately available on page load.
        // Wait briefly for it to appear so a connected wallet persists across refresh.
        const timeout = 5000; // ms
        const interval = 200; // ms
        const start = Date.now();
        let provider = modal.getWalletProvider?.();
        while (!provider && Date.now() - start < timeout) {
            await new Promise((res) => setTimeout(res, interval));
            provider = modal.getWalletProvider?.();
        }

        if (!provider) {
            setDisconnectedUI();
            return;
        }

        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const address = await signer.getAddress();

        if (address) {
            setConnectedUI(address);
        } else {
            setDisconnectedUI();
        }
    } catch (err) {
        setDisconnectedUI();
    }
}

// ---------------- LISTEN FOR STATE CHANGES ----------------
modal.subscribeState(() => {
    syncWalletState();
});

// ---------------- DISCONNECT ----------------
disconnectBtn?.addEventListener("click", async () => {
    try {
        await modal.disconnect();
    } catch (err) {
        console.error("Disconnect error:", err);
    } finally {
        // Hide disconnect button immediately and reset UI, then reload to clear state
        setDisconnectedUI();
        // Brief delay so user sees the UI change before reload
        setTimeout(() => {
            window.location.reload();
        }, 200);
    }
});

// Run once on load (auto-reconnect support)
syncWalletState();
