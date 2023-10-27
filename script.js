// Sample data structure for ideas
let ideas = [];

// Load ideas from local storage
if (localStorage.getItem('ideas')) {
    ideas = JSON.parse(localStorage.getItem('ideas'));
}

// Add an event listener to the form button to toggle the form's visibility and update button text
document.getElementById('toggleFormButton').addEventListener('click', function () {
    const ideaForm = document.getElementById('ideaForm');
    const toggleFormButton = document.getElementById('toggleFormButton');
    
    if (ideaForm.style.display === 'none' || ideaForm.style.display === '') {
        ideaForm.style.display = 'block';
        toggleFormButton.textContent = 'Hide Form';
    } else {
        ideaForm.style.display = 'none';
        toggleFormButton.textContent = 'Show Form';
    }
});

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

    const editForm = document.getElementById('editForm');
    editForm.style.display = 'none'; // Hide the edit form initially

    if (showIdeas) {
        output.innerHTML = '';

        ideas.forEach((idea, index) => {
            output.innerHTML += `<p><strong>${idea.timestamp}<br><br>Title:</strong> ${idea.title}</p>`;        
            output.innerHTML += `<p><strong>Description:</strong> ${idea.description}</p>`;
            output.innerHTML += `<p><strong>Tags:</strong> ${idea.tags.join(', ')}</p>`;
            if (idea.image) {
                output.innerHTML += `<img src="${idea.image}" width="200" height="auto" /><br>`;
            }
            output.innerHTML += `<div class="button-container">
            <button onclick="deleteIdea(${index})">Delete</button>
            <button onclick="editIdea(${index})">Edit</button>
        </div><br><br>`;
        });
    } else {
        output.innerHTML = '<h3>Ideas List</h3>'; // hide idea list
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

function editIdea(index) {
    // Get the selected idea
    const selectedIdea = ideas[index];

    // Populate the edit form with the selected idea's data
    document.getElementById("editTitle").value = selectedIdea.title;
    document.getElementById("editDescription").value = selectedIdea.description;
    document.getElementById("editTags").value = selectedIdea.tags.join(', ');

    // Show the edit form
    const editForm = document.getElementById('editForm');
    editForm.style.display = 'block';

    // Add a data attribute to the edit form to store the index of the idea being edited
    editForm.setAttribute('data-index', index);
}

function saveEditedIdea(event) {
    event.preventDefault();

    // Get the index of the idea being edited from the data attribute
    const index = parseInt(document.getElementById('editForm').getAttribute('data-index'));

    // Update the idea with the edited data
    ideas[index].title = document.getElementById("editTitle").value;
    ideas[index].description = document.getElementById("editDescription").value;
    ideas[index].tags = document.getElementById("editTags").value.split(',');

    // Handle the edited image if a new image is selected
    const editImageInput = document.getElementById("editImage");
    if (editImageInput.files.length > 0) {
        const editedImage = editImageInput.files[0];
        
        // You can use a FileReader to read the new image as a data URL
        const reader = new FileReader();
        reader.onload = function () {
            ideas[index].image = reader.result; // Set the new image data URL
            saveIdeas();
            listIdeas();
        };
        reader.readAsDataURL(editedImage);
    } else {
        // No new image selected, just save the edited data
        saveIdeas();
        listIdeas();
    }

    // Hide the edit form
    document.getElementById('editForm').style.display = 'none';

    // Clear the form fields
    document.getElementById("editTitle").value = '';
    document.getElementById("editDescription").value = '';
    document.getElementById("editTags").value = '';
    // Reset the image input field (clear any previously selected image)
    document.getElementById("editImage").value = '';
    
    // Reset the image preview
    document.getElementById("editImagePreview").src = ''; // Clear the image preview
}

document.getElementById('editForm').addEventListener('submit', saveEditedIdea);

// Add an event listener to close the edit form when the Cancel button is clicked
document.getElementById('cancelEdit').addEventListener('click', function () {
    const editForm = document.getElementById('editForm');
    const toggleEditFormButton = document.getElementById('toggleEditFormButton');
    
    editForm.style.display = 'none';
    toggleEditFormButton.textContent = 'Show Edit Form';
});

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

    document.getElementById("searchTags").value = '';

}

function listFilteredIdeas(filteredIdeas) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    filteredIdeas.forEach((idea, index) => {
        output.innerHTML += `<p><strong>${idea.timestamp}<br><br>Title:</strong> ${idea.title}</p>`;        output.innerHTML += `<p><strong>Description:</strong> ${idea.description}</p>`;
        output.innerHTML += `<p><strong>Tags:</strong> ${idea.tags.join(', ')}</p>`;
        if (idea.image) {
            output.innerHTML += `<img src="${idea.image}" width="500" height="auto" /><br>`;
        }
        output.innerHTML += `<div class="button-container">
        <button onclick="deleteIdea(${index})">Delete</button>
        <button onclick="editIdea(${index})">Edit</button>
    </div><br><br>`;
    });
}

document.getElementById('ideaForm').addEventListener('submit', addIdea);
document.getElementById('listButton').addEventListener('click', listIdeas);
document.getElementById('searchButton').addEventListener('click', searchIdeas);
