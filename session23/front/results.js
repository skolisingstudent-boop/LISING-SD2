    const API_BASE_URL = window.location.origin;

    function params() {
        const s = new URLSearchParams(window.location.search);
        return {
            schema: s.get('schema') || 'all',
            q: s.get('q') || '',
            all: s.get('all') === '1'
        };
    }

    function formatField(label, value) {
        return `<div class="meta"><strong>${label}</strong><br>${value ?? 'N/A'}</div>`;
    }

    function buildInventoryItem(item) {
        return `
            <div class="item" data-id="${item._id}">
                <div class="item-title">
                    <h4>${item.name || 'Unnamed Item'}</h4>
                    <div class="item-actions">
                        <button class="edit-btn" data-action="edit" data-id="${item._id}">Edit</button>
                        <button class="stocks-btn" data-action="stocks" data-id="${item._id}">Edit Stocks</button>
                        <button class="delete-btn" data-action="delete" data-id="${item._id}">Delete</button>
                    </div>
                </div>
                <div class="meta-grid">
                    ${formatField('Product Name', item.productName)}
                    ${formatField('SKU', item.sku)}
                    ${formatField('Category', item.category)}
                    ${formatField('Brand', item.brand)}
                    ${formatField('Supplier', item.supplier)}
                    ${formatField('Quantity', item.quantity ?? 0)}
                    ${formatField('Price', item.price != null ? `$${item.price.toFixed(2)}` : '$0.00')}
                    ${formatField('Stocks', item.stocks ?? 0)}
                    ${formatField('Reorder Level', item.reorderLevel ?? 0)}
                    ${formatField('Added', item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : 'Unknown')}
                </div>
            </div>
        `;
    }

    function buildCategoryItem(item) {
        return `
            <div class="item">
                <div class="item-title">
                    <h4>${item.categoryName || 'Unnamed Category'}</h4>
                </div>
                <div class="meta-grid">
                    ${formatField('Description', item.description)}
                    ${formatField('Added', item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : 'Unknown')}
                </div>
            </div>
        `;
    }

    function buildSupplierItem(item) {
        return `
            <div class="item">
                <div class="item-title">
                    <h4>${item.supplier || 'Unnamed Supplier'}</h4>
                </div>
                <div class="meta-grid">
                    ${formatField('Contact', item.contact)}
                    ${formatField('Address', item.address)}
                    ${formatField('Added', item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : 'Unknown')}
                </div>
            </div>
        `;
    }

    async function applyQuery() {
        const p = params();
        document.getElementById('title').textContent = `Results — ${p.schema}`;
        const url = `/api/search?schema=${encodeURIComponent(p.schema)}&q=${encodeURIComponent(p.q)}&all=${p.all ? 1 : 0}`;

        try {
            const res = await fetch(url);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Network response was not ok');
            }
            const data = await res.json();
            const results = document.getElementById('results');
            let html = '';
            const items = data.items || {};

            if (p.schema === 'all' || p.schema === 'inventory') {
                const inventoryItems = items.inventory || [];
                if (inventoryItems.length > 0) {
                    html += '<div class="group"><h3>Inventory Items</h3>' + inventoryItems.map(buildInventoryItem).join('') + '</div>';
                }
            }
            if (p.schema === 'all' || p.schema === 'category') {
                const categories = items.category || [];
                if (categories.length > 0) {
                    html += '<div class="group"><h3>Categories</h3>' + categories.map(buildCategoryItem).join('') + '</div>';
                }
            }
            if (p.schema === 'all' || p.schema === 'supplier') {
                const suppliers = items.supplier || [];
                if (suppliers.length > 0) {
                    html += '<div class="group"><h3>Suppliers</h3>' + suppliers.map(buildSupplierItem).join('') + '</div>';
                }
            }

            if (!html) {
                html = '<div class="no-results">No matching records found in the database.</div>';
            }

            results.innerHTML = html;
            bindResultActions();
        } catch (err) {
            const results = document.getElementById('results');
            results.innerHTML = `<div class="no-results">Failed to load results: ${err.message}</div>`;
            console.error(err);
        }
    }

    function filterClientSide() {
        const filterTerm = document.getElementById('filterInput').value.trim().toLowerCase();
        const allItems = document.querySelectorAll('.item');
        allItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = filterTerm ? (text.includes(filterTerm) ? '' : 'none') : '';
        });
    }

    function navigateToSearch() {
        window.location.href = 'index.html';
    }

    function closeModal() {
        document.getElementById('modalOverlay').classList.remove('show');
    }

    function openEditModal(item) {
        document.getElementById('editItemId').value = item._id;
        document.getElementById('editName').value = item.name || '';
        document.getElementById('editProductName').value = item.productName || '';
        document.getElementById('editSKU').value = item.sku || '';
        document.getElementById('editCategory').value = item.category || '';
        document.getElementById('editBrand').value = item.brand || '';
        document.getElementById('editSupplier').value = item.supplier || '';
        document.getElementById('editQuantity').value = item.quantity ?? 0;
        document.getElementById('editPrice').value = item.price ?? 0;
        document.getElementById('editReorder').value = item.reorderLevel ?? 0;
        document.getElementById('editStocks').value = item.stocks ?? 0;
        document.getElementById('modalOverlay').classList.add('show');
    }

    async function fetchItemById(itemId) {
        const response = await fetch(`/inventory/get-item?itemName=${encodeURIComponent(itemId)}`);
        return response.json();
    }

    async function deleteItem(itemId) {
        if (!confirm('Delete this inventory item from the database?')) return;
        const response = await fetch(`/inventory/delete/${encodeURIComponent(itemId)}`, { method: 'DELETE' });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || 'Unable to delete item.');
        }
        await applyQuery();
    }

    async function updateStocks(itemId) {
        const stocksValue = prompt('Enter the new stocks value:');
        if (stocksValue === null) return;
        const stocks = Number(stocksValue);
        if (Number.isNaN(stocks) || stocks < 0) {
            alert('Please enter a valid non-negative number.');
            return;
        }
        const response = await fetch(`/inventory/update-stocks/${encodeURIComponent(itemId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stocks })
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || 'Unable to update stocks.');
        }
        await applyQuery();
    }

    function bindResultActions() {
        document.querySelectorAll('.item-actions button').forEach(button => {
            button.addEventListener('click', async (event) => {
                const action = event.target.dataset.action;
                const itemId = event.target.dataset.id;
                if (!action || !itemId) return;

                try {
                    if (action === 'delete') {
                        await deleteItem(itemId);
                    } else if (action === 'stocks') {
                        await updateStocks(itemId);
                    } else if (action === 'edit') {
                        const itemContainer = event.target.closest('.item');
                        const dataElements = itemContainer.querySelectorAll('.meta');
                        const itemData = { _id: itemId };
                        dataElements.forEach(el => {
                            const label = el.querySelector('strong');
                            if (!label) return;
                            const text = el.textContent.replace(label.textContent, '').trim();
                            switch (label.textContent) {
                                case 'Product Name': itemData.productName = text; break;
                                case 'SKU': itemData.sku = text; break;
                                case 'Category': itemData.category = text; break;
                                case 'Brand': itemData.brand = text; break;
                                case 'Supplier': itemData.supplier = text; break;
                                case 'Quantity': itemData.quantity = Number(text); break;
                                case 'Price': itemData.price = Number(text.replace('$', '')) || 0; break;
                                case 'Stocks': itemData.stocks = Number(text); break;
                                case 'Reorder Level': itemData.reorderLevel = Number(text); break;
                            }
                        });
                        itemData.name = itemContainer.querySelector('.item-title h4')?.textContent || '';
                        openEditModal(itemData);
                    }
                } catch (err) {
                    alert(err.message || 'Action failed');
                    console.error(err);
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const paramsData = params();
        const schemaSelect = document.getElementById('schemaSelect');
        const filterInput = document.getElementById('filterInput');
        const backBtn = document.getElementById('backBtn');
        const refreshBtn = document.getElementById('refreshBtn');
        const newSearchBtn = document.getElementById('newSearchBtn');
        const applyFilter = document.getElementById('applyFilter');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const editForm = document.getElementById('editForm');

        if (paramsData.schema) {
            schemaSelect.value = paramsData.schema;
        }

        applyQuery();

        filterInput.addEventListener('input', filterClientSide);
        applyFilter.addEventListener('click', filterClientSide);
        backBtn.addEventListener('click', () => window.history.back());
        refreshBtn.addEventListener('click', applyQuery);
        newSearchBtn.addEventListener('click', navigateToSearch);

        schemaSelect.addEventListener('change', () => {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('schema', schemaSelect.value);
            queryParams.delete('all');
            if (schemaSelect.value === 'all') {
                queryParams.set('all', '1');
            }
            window.history.replaceState({}, '', `${window.location.pathname}?${queryParams.toString()}`);
            applyQuery();
        });

        closeModalBtn.addEventListener('click', closeModal);
        document.getElementById('modalOverlay').addEventListener('click', (event) => {
            if (event.target.id === 'modalOverlay') closeModal();
        });

        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const itemId = document.getElementById('editItemId').value;
            const payload = {
                name: document.getElementById('editName').value,
                productName: document.getElementById('editProductName').value,
                sku: document.getElementById('editSKU').value,
                category: document.getElementById('editCategory').value,
                brand: document.getElementById('editBrand').value,
                supplier: document.getElementById('editSupplier').value,
                quantity: Number(document.getElementById('editQuantity').value),
                price: Number(document.getElementById('editPrice').value),
                reorderLevel: Number(document.getElementById('editReorder').value),
                stocks: Number(document.getElementById('editStocks').value)
            };

            const response = await fetch(`/inventory/edit/${encodeURIComponent(itemId)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Unable to save item changes.');
            }

            await applyQuery();
            closeModal();
        });
    });
