// --- 1. GLOBALS & STATE ---
let isEditing = false;

// --- 2. CORE SAVING LOGIC ---

/**
 * Grabs all sections, titles, and links, and saves them as one JSON object.
 */
function savePageState() {
    const data = [];
    document.querySelectorAll('main section').forEach(section => {
        const title = section.querySelector('.title-input').value;
        const links = [];
        section.querySelectorAll('a').forEach(link => {
            links.push({
                name: link.querySelector('.link-text').innerText,
                url: link.href
            });
        });
        data.push({ title, links });
    });
    localStorage.setItem('dashboard-data', JSON.stringify(data));
}

/**
 * Clears the grid and rebuilds it from the saved JSON object.
 */
function loadPageState() {
    const savedData = localStorage.getItem('dashboard-data');
    if (!savedData) return;

    const data = JSON.parse(savedData);
    const mainGrid = document.querySelector('main');
    const addButton = document.getElementById('section-add-button');

    // Remove existing default sections
    document.querySelectorAll('main section').forEach(s => s.remove());

    data.forEach(secData => {
        const section = createSectionElement(secData.title);
        secData.links.forEach(linkObj => {
            // We use the helper to inject links into the section
            appendLinkToSection(section, linkObj.url, linkObj.name);
        });
        mainGrid.insertBefore(section, addButton);
    });

    loadIcons();
    applyEditMode(); 
}

// --- 3. ELEMENT CREATION HELPERS ---

function createSectionElement(titleValue = "") {
    const section = document.createElement('section');
    section.innerHTML = `
        <input class="title-input" type="text" placeholder="Title..." value="${titleValue}">
        <div class="link-container edit">
            <input class="link-input" type="text" placeholder="Link URL...">
            <input class="link-name-input" type="text" placeholder="Link Name...">
            <button onclick="handleManualAdd(this)" class="add-link-confirm-button">Add</button>
        </div>
        <button class="section-delete-button edit" onclick="this.parentElement.remove(); savePageState();">
            <i class="fas fa-trash"></i> Delete Section
        </button>
    `;

    // Save title whenever user finishes typing
    section.querySelector('.title-input').addEventListener('blur', savePageState);
    return section;
}

function appendLinkToSection(section, url, name) {
    const link = document.createElement('a');
    link.href = url;
    link.innerHTML = `
        <div class="icon-wrapper"></div>
        <span class="link-text">${name}</span>
        <button onclick="event.preventDefault(); event.stopPropagation(); this.closest('a').remove(); savePageState();" 
                class="link-delete-button edit">
            <i class="fas fa-trash"></i>
        </button>`;
    
    // Insert before the input container so inputs stay at bottom
    const container = section.querySelector('.link-container');
    section.insertBefore(link, container);
}

// --- 4. EVENT HANDLERS ---

function handleManualAdd(button) {
    const container = button.parentElement;
    const section = container.parentElement;
    const urlInput = container.querySelector('.link-input');
    const nameInput = container.querySelector('.link-name-input');

    let url = urlInput.value.trim();
    const name = nameInput.value.trim();

    if (!url || !name) return;

    // Basic URL formatting
    if (!url.startsWith('http')) url = 'https://' + url;

    appendLinkToSection(section, url, name);
    
    // Reset inputs
    urlInput.value = '';
    nameInput.value = '';
    
    loadIcons();
    savePageState();
    applyEditMode(); // Refresh visibility for the new link delete button
}

function toggleEdit() {
    isEditing = !isEditing;
    applyEditMode();
}

function applyEditMode() {
    document.querySelectorAll('.edit').forEach(el => {
        el.style.display = isEditing ? 'block' : 'none';
        // Use flex for the input container if your CSS requires it
        if (el.classList.contains('link-container') && isEditing) {
            el.style.display = 'flex';
        }
    });
}

function loadIcons() {
    document.querySelectorAll('section a').forEach(link => {
        const wrapper = link.querySelector('.icon-wrapper');
        if (wrapper && wrapper.children.length > 0) return; 

        try {
            const url = new URL(link.href);
            const domain = url.hostname;
            const img = document.createElement('img');
            img.src = `https://unavatar.io/${domain}?fallback=https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
            img.onerror = () => {
                img.style.display = 'none';
                wrapper.innerHTML = '<i class="fas fa-link"></i>';
            };
            wrapper.appendChild(img);
        } catch(e) {
            if (wrapper) wrapper.innerHTML = '<i class="fas fa-link"></i>';
        }
    });
}

// --- 5. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    const mainGrid = document.querySelector('main');
    const addButton = document.getElementById('section-add-button');

    // Load everything from localStorage
    loadPageState();

    // Setup Add Section Button
    addButton.addEventListener('click', () => {
        const newSec = createSectionElement();
        mainGrid.insertBefore(newSec, addButton);
        savePageState();
        applyEditMode();
    });

    // Initial icon load for any hardcoded HTML
    loadIcons();
    applyEditMode();

    // Search Logic
    const mainSearch = document.getElementById('search-input');
    if (mainSearch) {
        mainSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(mainSearch.value)}`;
            }
        });
    }
});