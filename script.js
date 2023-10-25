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
        output.innerHTML += `<button onclick="deleteIdea(${index})">Delete</button><br><br>`;
        // output.innerHTML += `<p><strong>Image:</strong> ${idea.myImg.join(', ')}</p><br>`;
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

/*// Add picture
window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('img');
            img.onload = () => {
                URL.revokeObjectURL(img.src);  // no longer needed, free memory
            }
  
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
        }
    });
  });*/

document.getElementById('ideaForm').addEventListener('submit', addIdea);
document.getElementById('listButton').addEventListener('click', listIdeas);
//document.getElementById('saveButton').addEventListener('click', saveIdeas);