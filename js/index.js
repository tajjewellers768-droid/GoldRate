let editing = false;

// 1. Function to Toggle Edit Mode
function toggleEdit() {
    editing = !editing;
    document.querySelectorAll('.editable').forEach(el => {
        el.contentEditable = editing;
        el.classList.toggle('editing', editing);
    });
}

// 2. Function to Download Board as Image
function download(type) {
    if (editing) toggleEdit();
    html2canvas(document.getElementById('board'), { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `jewellery-rate-board-${new Date().getTime()}.${type}`;
        link.href = canvas.toDataURL('image/' + type, 1);
        link.click();
    });
}

// 3. Auto-update Date
function updateCurrentDate() {
    const today = new Date();
    const formattedDate = String(today.getDate()).padStart(2, '0') + '/' +
        String(today.getMonth() + 1).padStart(2, '0') + '/' +
        today.getFullYear();

    const dateElement = document.querySelector('.date .editable');
    if (dateElement) {
        dateElement.textContent = formattedDate;
    }
}

// 4. Fetch Live Gold Rates & Sync "Our Rate"
async function fetchGoldRates() {
    try {
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.goodreturns.in/gold-rates/kolkata.html'));
        const data = await response.json();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        const rates = doc.querySelectorAll('.gold_silver_table tr td:nth-child(2)');
        
        if (rates.length >= 2) {
            // live24k is index 0, live22k is index 1 on this specific site
            const live24k = rates[0].innerText.trim().replace(/[^\d.]/g, '');
            const live22k = rates[1].innerText.trim().replace(/[^\d.]/g, '');
            
            const rows = document.querySelectorAll('.row');
            
            // Sync 22K (Row 0)
            const row22kRates = rows[0].querySelectorAll('.rate');
            row22kRates[0].textContent = live22k; // Newspaper Rate
            row22kRates[1].textContent = live22k; // OUR RATE (Synced)

            // Sync 24K (Row 2)
            const row24kRates = rows[2].querySelectorAll('.rate');
            row24kRates[0].textContent = live24k; // Newspaper Rate
            row24kRates[1].textContent = live24k; // OUR RATE (Synced)
            
            console.log("Kolkata Rates Synced Successfully");
        }
    } catch (error) {
        console.error("Error fetching rates:", error);
        // Fallback to static rates if API fails (Kolkata rates for Jan 3, 2026)
        const rows = document.querySelectorAll('.row');
        rows[0].querySelectorAll('.rate')[0].textContent = "1,24,850";
        rows[0].querySelectorAll('.rate')[1].textContent = "1,24,850";
        rows[2].querySelectorAll('.rate')[0].textContent = "1,36,200";
        rows[2].querySelectorAll('.rate')[1].textContent = "1,36,200";
    }
}

// Initialize on load
updateCurrentDate();
fetchGoldRates();
