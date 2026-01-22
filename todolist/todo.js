async function checkbox(button){
    const checkbox = button.children[0];
    checkbox.classList.add("fa-solid");
    checkbox.classList.remove("fa-regular");
    button.parentElement.style = "transform: translateX(350px);";
    

    await delay(500);
    
    remove(checkbox.parentElement.parentElement);
}

function remove(item){
    const itemparent = item.parentElement;
    item.remove();

    if(itemparent.children.length <= 1){
        itemparent.innerHTML += `<div class="item">
                <button class="checkbox" onclick="checkbox(this);"><i class="fa-regular fa-circle-check"></i></button>
                <textarea rows="1" placeholder="${funnyTasks[Math.round(Math.random()*funnyTasks.length-1)]}" oninput="autoResize(this)"></textarea>
            </div>`
    }
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function autoResize(element) {
    element.style.height = "auto";
    element.style.height = (element.scrollHeight) + "px";
}

document.addEventListener('keydown', function(e) {
    const textarea = e.target;
    if (textarea.tagName !== 'TEXTAREA') return;

    const currentItem = textarea.closest('.item');

    // Handle Enter Key (Previous Logic)
    if (e.key === 'Enter') {
        e.preventDefault();
        
        // 1. Get the current item
        const currentItem = e.target.closest('.item');
        const parent = currentItem.parentElement;

        // 2. Define the new item HTML
        const newItemHTML = `
            <div class="item">
                <button class="checkbox" onclick="checkbox(this);"><i class="fa-regular fa-circle-check"></i></button>
                <textarea rows="1" placeholder="${funnyTasks[Math.round(Math.random()*funnyTasks.length-1)]}" oninput="autoResize(this)"></textarea>
            </div>`;

        // 3. Insert it immediately after the current one
        currentItem.insertAdjacentHTML('afterend', newItemHTML);

        // 4. Focus the new textarea automatically
        const nextTextarea = currentItem.nextElementSibling.querySelector('textarea');
        nextTextarea.focus();
    }

    // Handle Backspace Key
    if (e.key === 'Backspace' && textarea.value === '') {
        const previousItem = currentItem.previousElementSibling;
        
        // Only delete if there is an item to go back to 
        // (prevents deleting the last remaining task box)
        if (previousItem && previousItem.classList.contains('item')) {
            e.preventDefault(); // Prevent deleting a character in the NEXT box
            
            const prevTextarea = previousItem.querySelector('textarea');
            
            // Delete the current item
            currentItem.remove();
            
            // Move focus to the end of the previous textarea
            prevTextarea.focus();
            
            // Optional: Set cursor to the end of the text
            const val = prevTextarea.value;
            prevTextarea.value = '';
            prevTextarea.value = val;
        }
    }
});

document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'TEXTAREA' && e.key === 'Enter') {
        
    }
});


const funnyTasks = [
  "Teach a goldfish physics",
  "Apologize to the toaster",
  "Organize lonely socks",
  "Practice surprised face",
  "Find the end of a circle",
  "Convince cat I am boss",
  "Google: Do penguins knee?",
  "Write bank apology letter",
  "Be 3 owls in a coat",
  "Explain sci-fi to bread",
  "Stare at clock intensely",
  "Motivate my houseplants",
  "Sneeze with eyes open",
  "Alphabetize my spices",
  "Forget why I am here",
  "Ask Siri out on a date",
  "Eat 20 marshmallows",
  "Link shadow on LinkedIn",
  "Count lollipop licks",
  "Find the traffic lights",
  "Practice lottery win",
  "Acting duel with fridge",
  "Find remote in my hand",
  "Stare down a pigeon",
  "Pronounce 'Bake' & 'Steak'",
  "Hide one googly eye",
  "Fold a fitted sheet",
  "Review my own kitchen",
  "Yoga until dog trips me",
  "Name garage spiders",
  "Whistle while eating",
  "Pick a grocery list font",
  "Debate pizza with a wall",
  "High-five the mirror",
  "Imagine a new color",
  "One-handed sandwich",
  "Microwave is judging me",
  "Practice Irish Goodbye",
  "Find the other 50% off",
  "Lie in five languages",
  "Prank call the dog",
  "Locate the 'Good Boy'",
  "Sign famous autographs",
  "Catch a bubble",
  "Use Force on the remote",
  "Invent Snack Day",
  "Shadowbox insecurities",
  "Celebrate finishing list"
];