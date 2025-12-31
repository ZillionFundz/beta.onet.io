// tvwidget.js

export function loadTradingView(containerId = "tv-chart") {
    if (!document.getElementById(containerId)) return;

    // Prevent duplicate initialization
    if (window.__tv_loaded) return;
    window.__tv_loaded = true;

    // Load TradingView core library first
    const tvCore = document.createElement("script");
    tvCore.src = "https://s3.tradingview.com/tv.js";
    tvCore.async = true;

    tvCore.onload = () => {
        const widgetScript = document.createElement("script");
        widgetScript.type = "text/javascript";

        widgetScript.innerHTML = `
            new TradingView.widget({
                container_id: "${containerId}",
                symbol: "NASDAQ:AAPL",
                interval: "D",
                timezone: "Etc/UTC",

                autosize: true,
                theme: "light",
                style: "1",

                hide_top_toolbar: false,
                hide_side_toolbar: false,
                hide_legend: false,

                allow_symbol_change: true,
                save_image: false,

                backgroundColor: "#3f475bff",
                gridColor: "rgba(255,255,255,0.06)"
            });
        `;

        document.body.appendChild(widgetScript);
    };

    document.head.appendChild(tvCore);
}
