// ==========================
// Staking Popup + Progress Bar
// ==========================

const stakeContainer = document.getElementById("stake-container");
const notificationExitBtn = document.getElementById("notification-exit-btn");
const notificationPopup = document.getElementById("notification-popup");
const stakeBtn = document.getElementById("stake-btn");
const stakeExitBtn = document.getElementById("stake-exit-btn");
const notificationCancelBtn = document.getElementById("notification-cancel-btn");
const notificationProceedBtn = document.getElementById("notification-proceed-btn");


// stakeContainer.style.visibility = 'hidden';
// stakeContainer.style.height = '0px';
let progress = 0;
let loader = null;
const progressBar = document.querySelector(".progress-bar");

// --------------------------
// Show staking popup
// --------------------------
stakeBtn.addEventListener('click', () => {
    notificationPopup.style.visibility = 'visible';
    notificationPopup.style.top = '45%';
    notificationPopup.style.opacity = '1';
    notificationPopup.style.transform = "translate(-50%, -50%) scale(1)";
});

// --------------------------
// Handle staking action
// --------------------------
notificationProceedBtn.addEventListener('click', () => {
    // Prevent double click
    notificationProceedBtn.disabled = true;

    startLoaderOnce();

    // Duration matches loader animation (5% every 250ms → 20 steps → 5000ms)
    const duration = 270 * (100 / 5);

    setTimeout(() => {
        // Ensure progress bar is fully filled
        progressBar.style.width = "100%";

        // Close popup smoothly
        notificationPopup.style.transform = "translate(-50%, -50%) scale(0.1)";
        notificationPopup.style.visibility = 'hidden';
        notificationPopup.style.opacity = '0';

        // Reset loader
        clearInterval(loader);
        loader = null;
        progress = 0;
        progressBar.style.width = "0%";

        // Re-enable button
        notificationProceedBtn.disabled = false;

        OpenStakeWindow();
    }, duration);
});

// --------------------------
// Start loader once
// --------------------------
function startLoaderOnce() {
    if (loader) clearInterval(loader);
    progress = 0;
    progressBar.style.width = "0%";
    startLoader();
}

// --------------------------
// Loader function
// --------------------------
function startLoader() {
    progress = 0;
    progressBar.style.width = "0%";

    loader = setInterval(() => {
        progress += 5;
        progressBar.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(loader);
            loader = null;
        }
    }, 250);
}

notificationExitBtn.addEventListener('click', () => {
    // Close popup smoothly
    notificationPopup.style.transform = "translate(-50%, -50%) scale(0.1)";
    notificationPopup.style.visibility = 'hidden';
    notificationPopup.style.opacity = '0';

    // Reset loader
    clearInterval(loader);
    loader = null;
    progress = 0;
    progressBar.style.width = "0%";

    // Re-enable button
    notificationProceedBtn.disabled = false;

    alert("Staking Aborted!");
});
// ==========================================

// --------------------------
// Cancel Button UI
// --------------------------
notificationCancelBtn.addEventListener('click', () => {
    // Close popup smoothly
    notificationPopup.style.transform = "translate(-50%, -50%) scale(0.1)";
    notificationPopup.style.visibility = 'hidden';
    notificationPopup.style.opacity = '0';
    // Reset loader
    clearInterval(loader);
    loader = null;
    progress = 0;
    progressBar.style.width = "0%";
    // Re-enable button
    notificationProceedBtn.disabled = false;
    alert("Staking Cancelled!");
});

// --------------------------
// Handle stake exit button
// --------------------------
stakeExitBtn.addEventListener('click', () => {
    stakeContainer.style.visibility = 'hidden';
    stakeContainer.style.height = '0px';
    document.body.classList.remove('no-scroll');
});

// --------------------------
// Open Stake Window
// --------------------------
function OpenStakeWindow() {
    document.body.classList.add('no-scroll');
    stakeContainer.style.visibility = 'visible';
    stakeContainer.style.height = '100vh';
}
