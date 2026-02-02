document.getElementById("trans-button").classList.remove("activetransition");

async function gototodo() {
    document.getElementById('trans-button').classList.add('activetransition');
    await delay(500);

    console.log("Waited");
    if(!window.location.href.includes("html")){
        window.open(window.location.href.substring(0, window.location.href.length - "/todolist?transition=true".length) + "?transition=true", "_self");
    } else {
        window.open("file:///C:/Users/tomfr/Documents/GitHub/NewTab/index.html?transition=true", "_self");
    }
}

async function checkbox(button) {
    const checkbox = button.children[0];
    checkbox.classList.add("fa-solid");
    checkbox.classList.remove("fa-regular");
    button.parentElement.style = "transform: translateX(350px);";

    await delay(500);

    const item = checkbox.parentElement.parentElement;
    remove(item);
    savePageState(); 
}

function add() {
    const wrapper = document.getElementById("content-wrapper");
    const newListHTML = `
        <div class="to-do-list">
            <input class="title-input" type="text" placeholder="Title..." oninput="savePageState()">
            <div class="item">
                <button class="checkbox" onclick="checkbox(this);"><i class="fa-regular fa-circle-check"></i></button>
                <textarea rows="1" placeholder="${getRandomPlaceholder()}" oninput="autoResize(this); savePageState();"></textarea>
            </div>
            <button class="delete-button" onclick="this.parentElement.remove(); savePageState();">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    wrapper.insertAdjacentHTML('beforeend', newListHTML);
    savePageState();
}

function remove(item) {
    const itemparent = item.parentElement;
    item.remove();

    if (itemparent.children.length <= 2) {
        itemparent.insertAdjacentHTML('beforeend', `
            <div class="item">
                <button class="checkbox" onclick="checkbox(this);"><i class="fa-regular fa-circle-check"></i></button>
                <textarea rows="1" placeholder="${getRandomPlaceholder()}" oninput="autoResize(this); savePageState();"></textarea>
            </div>`);
    }
    savePageState();
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function autoResize(element) {
    element.style.height = "auto";
    element.style.height = (element.scrollHeight) + "px";
}

function getRandomPlaceholder() {
    return funnyTasks[Math.floor(Math.random() * funnyTasks.length)];
}

// --- Persistence Logic (Updated for Placeholders) ---

function savePageState() {
    const data = [];
    document.querySelectorAll('.to-do-list').forEach(list => {
        const title = list.querySelector('.title-input').value;
        const tasks = [];
        list.querySelectorAll('.item textarea').forEach(textarea => {
            tasks.push({
                text: textarea.value,
                placeholder: textarea.placeholder // Now saving the placeholder text!
            });
        });
        data.push({ title, tasks });
    });
    localStorage.setItem('todo-data', JSON.stringify(data));
}

function loadPageState() {
    const savedData = localStorage.getItem('todo-data');
    if (!savedData) return;

    const data = JSON.parse(savedData);
    const wrapper = document.getElementById("content-wrapper");
    wrapper.innerHTML = ''; 

    data.forEach(listData => {
        const listDiv = document.createElement('div');
        listDiv.className = 'to-do-list';

        let itemsHTML = listData.tasks.map(taskObj => `
            <div class="item">
                <button class="checkbox" onclick="checkbox(this);"><i class="fa-regular fa-circle-check"></i></button>
                <textarea rows="1" 
                          placeholder="${taskObj.placeholder || getRandomPlaceholder()}" 
                          oninput="autoResize(this); savePageState();">${taskObj.text || ''}</textarea>
            </div>
        `).join('');

        if (listData.tasks.length === 0) {
            itemsHTML = `
                <div class="item">
                    <button class="checkbox" onclick="checkbox(this);"><i class="fa-regular fa-circle-check"></i></button>
                    <textarea rows="1" placeholder="${getRandomPlaceholder()}" oninput="autoResize(this); savePageState();"></textarea>
                </div>`;
        }

        listDiv.innerHTML = `
            <input class="title-input" type="text" placeholder="Title..." value="${listData.title}" oninput="savePageState()">
            ${itemsHTML}
            <button class="delete-button" onclick="this.parentElement.remove(); savePageState();">
                <i class="fas fa-trash"></i>
            </button>
        `;
        wrapper.appendChild(listDiv);
        listDiv.querySelectorAll('textarea').forEach(autoResize);
    });
}

// --- Event Listeners ---

document.addEventListener('keydown', function(e) {
    const textarea = e.target;
    if (textarea.tagName !== 'TEXTAREA') return;

    const currentItem = textarea.closest('.item');

    if (e.key === 'Enter') {
        e.preventDefault();
        const newItemHTML = `
            <div class="item">
                <button class="checkbox" onclick="checkbox(this);"><i class="fa-regular fa-circle-check"></i></button>
                <textarea rows="1" placeholder="${getRandomPlaceholder()}" oninput="autoResize(this); savePageState();"></textarea>
            </div>`;
        currentItem.insertAdjacentHTML('afterend', newItemHTML);
        const nextTextarea = currentItem.nextElementSibling.querySelector('textarea');
        nextTextarea.focus();
        savePageState();
    }

    if (e.key === 'Backspace' && textarea.value === '') {
        const previousItem = currentItem.previousElementSibling;
        if (previousItem && previousItem.classList.contains('item')) {
            e.preventDefault();
            const prevTextarea = previousItem.querySelector('textarea');
            currentItem.remove();
            prevTextarea.focus();
            const val = prevTextarea.value;
            prevTextarea.value = '';
            prevTextarea.value = val;
            savePageState();
        }
    }
});

window.addEventListener('DOMContentLoaded', loadPageState);

const funnyTasks = [
    "Teach a goldfish physics", "Apologize to the toaster", "Organize lonely socks",
    "Practice surprised face", "Find the end of a circle", "Convince cat I am boss",
    "Google: Do penguins knee?", "Write bank apology letter", "Be 3 owls in a coat",
    "Explain sci-fi to bread", "Stare at clock intensely", "Motivate my houseplants",
    "Sneeze with eyes open", "Alphabetize my spices", "Forget why I am here",
    "Ask Siri out on a date", "Eat 20 marshmallows", "Link shadow on LinkedIn",
    "Count lollipop licks", "Find the traffic lights", "Practice lottery win",
    "Acting duel with fridge", "Find remote in my hand", "Stare down a pigeon",
    "Pronounce 'Bake' & 'Steak'", "Hide one googly eye", "Fold a fitted sheet",
    "Review my own kitchen", "Yoga until dog trips me", "Name garage spiders",
    "Whistle while eating", "Pick a grocery list font", "Debate pizza with a wall",
    "High-five the mirror", "Imagine a new color", "One-handed sandwich",
    "Microwave is judging me", "Practice Irish Goodbye", "Find the other 50% off",
    "Lie in five languages", "Prank call the dog", "Locate the 'Good Boy'",
    "Sign famous autographs", "Catch a bubble", "Use Force on the remote",
    "Invent Snack Day", "Shadowbox insecurities", "Celebrate finishing list",
    "Argue with a receipt", "Befriend a rogue moth", "Check for monsters",
    "Draft a snail's will", "Edit a cloud's resume", "Fix a broken shadow",
    "Greet every spoon", "Help a grape escape", "Insult a lemon",
    "Judge a book's spine", "Keep a secret from dog", "Listen to the cheese",
    "Measure a yawn", "Negotiate with stairs", "Outrun my problems",
    "Pet a polite rock", "Question the blender", "Rename my left foot",
    "Scold the Wi-Fi", "Tax my imaginary gold", "Unlock the air",
    "Visit the dust bunnies", "Warn the neighbors", "X-ray a jellybean",
    "Yell at a marshmallow", "Zip a zipper slowly", "Add glitter to salad",
    "Buy a hat for a tree", "Call a toll-free bird", "Dance with a mop",
    "Eavesdrop on plants", "File my thumbprints", "Ghost a telemarketer",
    "Hum the color blue", "Inhale a breadstick", "Jump over a mood",
    "Kidnap a gnome", "Lick a frozen pole", "Mime a heavy thought",
    "Notice the wallpaper", "Order a pizza for 2027", "Paint a grape's nails",
    "Quietly judge milk", "Read a pasta box", "Smell a math book",
    "Tickle a cactus", "Update the cat", "Vacuum the yard"
];