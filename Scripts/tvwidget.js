// ===========================================================
// TradingView Advanced Chart (SAFE + STABLE VERSION)
// ===========================================================

export function loadTradingView(containerId = "tv-chart", options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Prevent double initialization
    if (container.dataset.tvLoaded === "true") return;
    container.dataset.tvLoaded = "true";

    // Ensure container has size BEFORE init
    container.style.width = "100%";
    container.style.height = options.height || "500px";

    // TradingView must already exist globally
    if (typeof window.TradingView === "undefined") {
        console.error("TradingView library not loaded. Add tv.js in HTML before main.js");
        return;
    }

    // Delay slightly to ensure layout is settled
    requestAnimationFrame(() => {
        new window.TradingView.widget({
            container_id: containerId,

            // ================= CORE =================
            symbol: options.symbol || "NASDAQ:AAPL",
            interval: options.interval || "D",
            timezone: options.timezone || "Etc/UTC",

            width: "100%",
            height: options.height || 500,
            autosize: false,

            // ---- STYLE ----
            style: options.style || "1",
            theme: options.theme || "dark",
            backgroundColor: options.backgroundColor || "#2c2c2cff",
            gridColor: options.gridColor || "rgba(255,255,255,0.06)",


            // ================= UI =================
            hide_top_toolbar: options.hide_top_toolbar ?? false,
            hide_side_toolbar: options.hide_side_toolbar ?? false,
            hide_legend: options.hide_legend ?? false,

            allow_symbol_change: options.allow_symbol_change ?? true,
            save_image: options.save_image ?? false,

            // ================= EXTRAS =================
            locale: options.locale || "en",
            disabled_features: options.disabled_features || [],
            enabled_features: options.enabled_features || [],

            // Stability improvement
            withdateranges: false,
        });
    });
}
