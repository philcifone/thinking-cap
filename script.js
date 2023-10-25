// Sample data structure for ideas
let ideas = [];

// Load ideas from local storage
if (localStorage.getItem('ideas')) {
    ideas = JSON.parse(localStorage.getItem('ideas'));
}

// Function to add an idea
function addIdea(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const tags = document.getElementById("tags").value.split(',');
    ideas.push({ title, description, tags });

    // Clear form fields
    document.getElementById("title").value = '';
    document.getElementById("description").value = '';
    document.getElementById("tags").value = '';

    listIdeas();
    saveIdeas();
}

// Function to list ideas
function listIdeas() {
    const output = document.getElementById('output');
    output.innerHTML = '';

    ideas.forEach((idea, index) => {
        output.innerHTML += `<p><strong>${index + 1}. Title:</strong> ${idea.title}</p>`;
        output.innerHTML += `<p><strong>Description:</strong> ${idea.description}</p>`;
        output.innerHTML += `<p><strong>Tags:</strong> ${idea.tags.join(', ')}</p><br>`;
    });
}

// Function to save ideas to local storage
function saveIdeas() {
    localStorage.setItem('ideas', JSON.stringify(ideas));
}

document.getElementById('ideaForm').addEventListener('submit', addIdea);
document.getElementById('listButton').addEventListener('click', listIdeas);
//document.getElementById('saveButton').addEventListener('click', saveIdeas);