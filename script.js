// Sample data structure for ideas
let ideas = [];

// Load ideas from local storage
if (localStorage.getItem('ideas')) {
    ideas = JSON.parse(localStorage.getItem('ideas'));
}

// Function to add an idea
function addIdea(event) {
    event.preventDefault();

    const timestamp = new Date().toLocaleString('en-US', {
        hour12: false, // Ensure 24-hour format
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const tags = document.getElementById("tags").value.split(',');
    const image = document.getElementById("image").files[0]; // get image file
    
    // FileReader to read image as data URL
    const reader = new FileReader();
    reader.onload = function () {
        const imageDataUrl = reader.result; // get data url
        ideas.push({ timestamp, title, description, tags, image: imageDataUrl });
        listIdeas();
        saveIdeas();
    };

    // Check if image is selected, if else statement since image is not required
    if (image) {
        reader.readAsDataURL(image); // convert image to data URL
    } else {
        ideas.push({ timestamp, title, description, tags, image: null });
        listIdeas();
        saveIdeas();
    };

    // Clear form fields
    document.getElementById("title").value = '';
    document.getElementById("description").value = '';
    document.getElementById("tags").value = '';
    document.getElementById("image").value= '';
}

// Function to list ideas
function listIdeas() {
    const output = document.getElementById('output');

    if (showIdeas) {
        output.innerHTML = '';

        ideas.forEach((idea, index) => {
            output.innerHTML += `<p><strong>${idea.timestamp}<br><br>Title:</strong> ${idea.title}</p>`;        
            output.innerHTML += `<p><strong>Description:</strong> ${idea.description}</p>`;
            output.innerHTML += `<p><strong>Tags:</strong> ${idea.tags.join(', ')}</p><br>`;
            if (idea.image) {
                output.innerHTML += `<img src="${idea.image}" width="200" height="auto" /><br>`;
            }
            output.innerHTML += `<button onclick="deleteIdea(${index})">Delete</button><br><br>`;
            output.innerHTML += `<button onclick="editIdea(${index})">Edit</button><br><br>`;
        });
    } else {
        output.innerHTML = ''; // hide idea list
    }
}

// Toggle visibility and button text for the idea list
let showIdeas = false; // Variable to keep track of the idea list visibility

document.getElementById('listButton').addEventListener('click', function () {
    showIdeas = !showIdeas; // Toggle the state

    const listButton = document.getElementById('listButton');
    if (showIdeas) {
        listButton.textContent = 'Hide Ideas'; // Change button text to "Hide Ideas"
        listIdeas(); // Show the idea list
    } else {
        listButton.textContent = 'List Ideas'; // Change button text back to "List Ideas"
        const output = document.getElementById('output');
        output.innerHTML = ''; // Clear the idea list
    }
});

// Function to save ideas to local storage
function saveIdeas() {
    localStorage.setItem('ideas', JSON.stringify(ideas));
}

// Function to edit idea
function editIdea(index) {
    const newDescription = prompt("Edit the Description:", ideas[index].description);
    if (newDescription !== null) {
        ideas[index].description = newDescription;
        saveIdeas();
        listIdeas();
    }
}

// Function to delete an idea by index
function deleteIdea(index) {
    // Display a confirmation dialog
    const confirmation = confirm("Are you sure you want to delete this idea?");
    
    if (confirmation) {
        ideas.splice(index, 1);

        // Save ideas to local storage after deleting
        saveIdeas();

        // Update the list of ideas
        listIdeas();
    }
}

// Search Ideas function
function searchIdeas () {
    const searchTags = document.getElementById("searchTags").value.trim().toLowerCase();
    const filteredIdeas = ideas.filter(idea => {
        return idea.tags.some(tag => tag.toLowerCase().includes(searchTags));
    });

    listFilteredIdeas(filteredIdeas);
}

function listFilteredIdeas(filteredIdeas) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    filteredIdeas.forEach((idea, index) => {
        output.innerHTML += `<p><strong>${idea.timestamp}<br><br>Title:</strong> ${idea.title}</p>`;        output.innerHTML += `<p><strong>Description:</strong> ${idea.description}</p>`;
        output.innerHTML += `<p><strong>Tags:</strong> ${idea.tags.join(', ')}</p>`;
        if (idea.image) {
            output.innerHTML += `<img src="${idea.image}" width="200" height="auto" /><br>`;
        }
        output.innerHTML += `<button onclick="deleteIdea(${index})">Delete</button><br><br>`;
    });
}

document.getElementById('ideaForm').addEventListener('submit', addIdea);
document.getElementById('listButton').addEventListener('click', listIdeas);
document.getElementById('searchButton').addEventListener('click', searchIdeas);
