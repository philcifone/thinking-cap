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
    const image = document.getElementById("image").files[0]; // get image file
    
    // FileReader to read image as data URL
    const reader = new FileReader();
    reader.onload = function () {
        const imageDataUrl = reader.result; // get data url
        ideas.push({ title, description, tags, image: imageDataUrl});
        listIdeas();
        saveIdeas();
    };

    // Check if image is selected, if else statement since image is not required
    if (image) {
        reader.readAsDataURL(image); // convert image to data URL
    } else {
        ideas.push({ title, description, tags, image: null });
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
    output.innerHTML = '';

    ideas.forEach((idea, index) => {
        output.innerHTML += `<p><strong>${index + 1}. Title:</strong> ${idea.title}</p>`;
        output.innerHTML += `<p><strong>Description:</strong> ${idea.description}</p>`;
        output.innerHTML += `<p><strong>Tags:</strong> ${idea.tags.join(', ')}</p><br>`;
        if (idea.image) {
            output.innerHTML += `<img src="${idea.image}" width="200" height="auto" /><br>`;
        }
        output.innerHTML += `<button onclick="deleteIdea(${index})">Delete</button><br><br>`;
    });
}

// Function to save ideas to local storage
function saveIdeas() {
    localStorage.setItem('ideas', JSON.stringify(ideas));
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

document.getElementById('ideaForm').addEventListener('submit', addIdea);
document.getElementById('listButton').addEventListener('click', listIdeas);