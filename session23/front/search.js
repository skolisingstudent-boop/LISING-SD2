// search.js - client-side search logic for session23/index.html
const API_BASE_URL = window.location.origin;
let currentSearchType = 'all';

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function clearError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

function showLoading() {
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = '<p class="loading">Searching the connected database...</p>';
    document.getElementById('resultsContainer').classList.add('show');
}

async function fetchSearch(searchQuery, schema) {
    const params = new URLSearchParams();
    if (schema === 'all') {
        params.set('all', '1');
    } else {
        params.set('schema', schema);
    }

    if (searchQuery) {
        params.set('q', searchQuery);
    }

    const response = await fetch(`${API_BASE_URL}/api/search?${params.toString()}`);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Search request failed');
    }
    return response.json();
}

function buildInventoryHtml(items) {
    if (!items || items.length === 0) {
        return '';
    }

    const rows = items.map(item => {
        const fields = [
            { label: 'Item Name', value: item.name || 'N/A' },
            { label: 'Product Name', value: item.productName || 'N/A' },
            { label: 'SKU', value: item.sku || 'N/A' },
            { label: 'Category', value: item.category || 'N/A' },
            { label: 'Brand', value: item.brand || 'N/A' },
            { label: 'Supplier', value: item.supplier || 'N/A' },
            { label: 'Quantity', value: item.quantity ?? 0 },
            { label: 'Price', value: item.price != null ? `$${item.price.toFixed(2)}` : '$0.00' },
            { label: 'Stocks', value: item.stocks ?? 0 },
            { label: 'Reorder Level', value: item.reorderLevel ?? 0 }
        ];

        const metaHtml = fields.map(field => `
            <div class="meta-block">
                <strong>${field.label}</strong><br>${field.value}
            </div>
        `).join('');

        return `
            <div class="result-item" data-id="${item._id}">
                <h4>${item.name || 'Untitled item'}</h4>
                <div class="result-meta">${metaHtml}</div>
                <div class="item-actions">
                    <button class="edit-btn" data-action="edit" data-id="${item._id}">Edit</button>
                    <button class="stocks-btn" data-action="stocks" data-id="${item._id}">Edit Stocks</button>
                    <button class="delete-btn" data-action="delete" data-id="${item._id}">Delete</button>
                </div>
            </div>
        `;
    });

    return `
        <div class="results-header">📦 Inventory Items</div>
        ${rows.join('')}
    `;
}

function buildCategoriesHtml(items) {
    if (!items || items.length === 0) {
        return '';
    }
    const rows = items.map(item => `
        <div class="result-item">
            <h4>${item.categoryName || 'Unnamed Category'}</h4>
            <div class="result-meta">
                <div class="meta-block"><strong>Description</strong><br>${item.description || 'No description'}</div>
                <div class="meta-block"><strong>Date Added</strong><br>${new Date(item.dateAdded).toLocaleDateString()}</div>
            </div>
        </div>
    `);
    return `
        <div class="results-header">📂 Categories</div>
        ${rows.join('')}
    `;
}

function buildSuppliersHtml(items) {
    if (!items || items.length === 0) {
        return '';
    }
    const rows = items.map(item => `
        <div class="result-item">
            <h4>${item.supplier || 'Unnamed Supplier'}</h4>
            <div class="result-meta">
                <div class="meta-block"><strong>Contact</strong><br>${item.contact || 'N/A'}</div>
                <div class="meta-block"><strong>Address</strong><br>${item.address || 'N/A'}</div>
                <div class="meta-block"><strong>Date Added</strong><br>${new Date(item.dateAdded).toLocaleDateString()}</div>
            </div>
        </div>
    `);
    return `
        <div class="results-header">🏢 Suppliers</div>
        ${rows.join('')}
    `;
}

function displayResults(data) {
    const resultsContent = document.getElementById('resultsContent');
    let html = '';
    const inventoryHtml = buildInventoryHtml(data.items.inventory || []);
    const categoryHtml = buildCategoriesHtml(data.items.category || []);
    const supplierHtml = buildSuppliersHtml(data.items.supplier || []);

    html += inventoryHtml;
    html += categoryHtml;
    html += supplierHtml;

    if (!html.trim()) {
        html = '<p class="no-results">No results found. Try a broader keyword or a different category.</p>';
    }
    resultsContent.innerHTML = html;
    document.getElementById('resultsContainer').classList.add('show');
}

async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    clearError();
    showLoading();

    try {
        const data = await fetchSearch(query, currentSearchType);
        displayResults(data);
    } catch (error) {
        showError('Error performing search: ' + error.message);
        console.error('Search error:', error);
        document.getElementById('resultsContent').innerHTML = '<p class="no-results">Unable to get results right now.</p>';
    }
}

async function deleteItem(itemId) {
    const confirmed = window.confirm('Delete this inventory item from the database?');
    if (!confirmed) return;

    const response = await fetch(`${API_BASE_URL}/inventory/delete/${itemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Delete failed');
    }
    await performSearch();
}

async function updateStocks(itemId) {
    const stocks = prompt('Enter the new stock quantity for this item:');
    if (stocks === null) return;
    const stocksNumber = Number(stocks);
    if (Number.isNaN(stocksNumber) || stocksNumber < 0) {
        alert('Please enter a valid non-negative stock value.');
        return;
    }

    const response = await fetch(`${API_BASE_URL}/inventory/update-stocks/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stocks: stocksNumber })
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Stocks update failed');
    }
    await performSearch();
}

async function editItem(itemId) {
    const itemName = prompt('New item name (leave blank to keep current):');
    if (itemName === null) return;

    const productName = prompt('New product name (leave blank to keep current):');
    if (productName === null) return;

    const sku = prompt('New SKU (leave blank to keep current):');
    if (sku === null) return;

    const category = prompt('New category (leave blank to keep current):');
    if (category === null) return;

    const quantityRaw = prompt('New quantity (leave blank to keep current):');
    if (quantityRaw === null) return;

    const priceRaw = prompt('New price (leave blank to keep current):');
    if (priceRaw === null) return;

    const brand = prompt('New brand (leave blank to keep current):');
    if (brand === null) return;

    const supplier = prompt('New supplier (leave blank to keep current):');
    if (supplier === null) return;

    const reorderLevelRaw = prompt('New reorder level (leave blank to keep current):');
    if (reorderLevelRaw === null) return;

    const stockRaw = prompt('New stocks value (leave blank to keep current):');
    if (stockRaw === null) return;

    const updatePayload = {};
    if (itemName.trim()) updatePayload.name = itemName.trim();
    if (productName.trim()) updatePayload.productName = productName.trim();
    if (sku.trim()) updatePayload.sku = sku.trim();
    if (category.trim()) updatePayload.category = category.trim();
    if (quantityRaw.trim()) updatePayload.quantity = Number(quantityRaw);
    if (priceRaw.trim()) updatePayload.price = Number(priceRaw);
    if (brand.trim()) updatePayload.brand = brand.trim();
    if (supplier.trim()) updatePayload.supplier = supplier.trim();
    if (reorderLevelRaw.trim()) updatePayload.reorderLevel = Number(reorderLevelRaw);
    if (stockRaw.trim()) updatePayload.stocks = Number(stockRaw);

    const response = await fetch(`${API_BASE_URL}/inventory/edit/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Update failed');
    }
    await performSearch();
}

async function addNewItem(formData) {
    const body = {
        name: formData.get('name'),
        productName: formData.get('productName'),
        sku: formData.get('sku'),
        category: formData.get('category'),
        quantity: Number(formData.get('quantity') || 0),
        price: Number(formData.get('price') || 0),
        supplier: formData.get('supplier'),
        reorderLevel: Number(formData.get('reorderLevel') || 0),
        brand: formData.get('brand'),
        stocks: Number(formData.get('stocks') || 0)
    };

    const response = await fetch(`${API_BASE_URL}/inventory/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Unable to add the inventory item');
    }

    const result = await response.json();
    return result;
}

function getSearchTypeButtons() {
    return Array.from(document.querySelectorAll('.option-btn'));
}

function updateActiveSearchButton(button) {
    getSearchTypeButtons().forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentSearchType = button.dataset.type;
}

function openResultsPage() {
    const query = document.getElementById('searchInput').value.trim();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (currentSearchType !== 'all') params.set('schema', currentSearchType);
    if (currentSearchType === 'all') params.set('all', '1');

    window.location.href = `results.html?${params.toString()}`;
}

function toggleAddPanel() {
    const panel = document.getElementById('addPanel');
    panel.classList.toggle('show');
}

function bindResultActions() {
    document.getElementById('resultsContent').addEventListener('click', async (event) => {
        const button = event.target.closest('button');
        if (!button || !button.dataset.action) return;

        const itemId = button.dataset.id;
        if (!itemId) return;

        try {
            if (button.dataset.action === 'delete') {
                await deleteItem(itemId);
            } else if (button.dataset.action === 'edit') {
                await editItem(itemId);
            } else if (button.dataset.action === 'stocks') {
                await updateStocks(itemId);
            }
        } catch (error) {
            showError(error.message);
            console.error(error);
        }
    });
}

function initSearchControls() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const viewResultsButton = document.getElementById('viewResultsButton');
    const toggleAddButton = document.getElementById('toggleAddForm');
    const addItemForm = document.getElementById('addItemForm');

    searchInput.addEventListener('input', debounce(performSearch, 350));
    searchButton.addEventListener('click', performSearch);
    viewResultsButton.addEventListener('click', openResultsPage);
    toggleAddButton.addEventListener('click', toggleAddPanel);

    getSearchTypeButtons().forEach(btn => {
        btn.addEventListener('click', () => {
            updateActiveSearchButton(btn);
            if (searchInput.value.trim()) {
                performSearch();
            }
        });
    });

    addItemForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearError();
        const formData = new FormData(addItemForm);

        try {
            await addNewItem(formData);
            addItemForm.reset();
            alert('Inventory item saved successfully.');
            performSearch();
        } catch (error) {
            showError(error.message);
            console.error('Add item failed:', error);
        }
    });

    bindResultActions();
}

document.addEventListener('DOMContentLoaded', initSearchControls);
