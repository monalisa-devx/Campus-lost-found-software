const STORAGE_KEY = "campusReports";

function getItems() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}


// REPORT PAGE

const reportForm = document.getElementById("reportForm");

if (reportForm) {

    reportForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const item = {
            id: Date.now(),
            name: document.getElementById("itemName").value.trim(),
            type: document.getElementById("itemType").value,
            category: document.getElementById("category").value,
            location: document.getElementById("location").value.trim(),
            description: document.getElementById("description").value.trim()
        };

        let items = getItems();

        items.push(item);

        saveItems(items);

        document.getElementById("message").textContent =
            "Report submitted successfully!";

        reportForm.reset();

    });

}


// BROWSE PAGE

const itemsContainer = document.getElementById("itemsContainer");

function displayItems() {

    if (!itemsContainer) return;

    const search = document.getElementById("searchInput").value.toLowerCase();

    const filter = document.getElementById("filterType").value;

    const items = getItems();

    const filtered = items.filter(function(item) {

        const matchesSearch =
            item.name.toLowerCase().includes(search) ||
            item.location.toLowerCase().includes(search);

        const matchesType =
            filter === "All" || item.type === filter;

        return matchesSearch && matchesType;

    });

    itemsContainer.innerHTML = "";

    if (filtered.length === 0) {
        itemsContainer.innerHTML = "<p>No items found.</p>";
        return;
    }

    filtered.forEach(function(item) {

        itemsContainer.innerHTML += `
            <div class="item-card">
                <h3>${escapeHTML(item.name)}</h3>
                <p>Type: ${escapeHTML(item.type)}</p>
                <p>Category: ${escapeHTML(item.category)}</p>
                <p>Location: ${escapeHTML(item.location)}</p>
                <p>${escapeHTML(item.description)}</p>
            </div>
        `;

    });

}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

if (itemsContainer) {

    document.getElementById("searchInput")
        .addEventListener("input", displayItems);

    document.getElementById("filterType")
        .addEventListener("change", displayItems);

    displayItems();

}


// MANAGE PAGE

const manageContainer = document.getElementById("manageContainer");

function displayManageItems() {

    if (!manageContainer) return;

    const items = getItems();

    manageContainer.innerHTML = "";

    if (items.length === 0) {
        manageContainer.innerHTML = "<p>No reports available.</p>";
        return;
    }

    items.forEach(function(item) {

        manageContainer.innerHTML += `
            <div class="item-card">
                <h3>${escapeHTML(item.name)}</h3>
                <p>Type: ${escapeHTML(item.type)}</p>
                <p>Location: ${escapeHTML(item.location)}</p>

                <button class="delete-btn"
                    data-id="${item.id}">
                    Delete Report
                </button>
            </div>
        `;

    });

}

if (manageContainer) {

    manageContainer.addEventListener("click", function(event) {

        if (!event.target.matches(".delete-btn")) return;

        const id = Number(event.target.dataset.id);

        const updatedItems = getItems().filter(function(item) {
            return item.id !== id;
        });

        saveItems(updatedItems);

        displayManageItems();

    });

    displayManageItems();

}


// HOME PAGE STATISTICS

const totalItems = document.getElementById("totalItems");

if (totalItems) {

    const items = getItems();

    totalItems.textContent = items.length;

    document.getElementById("lostItems").textContent =
        items.filter(item => item.type === "Lost").length;

    document.getElementById("foundItems").textContent =
        items.filter(item => item.type === "Found").length;

}
