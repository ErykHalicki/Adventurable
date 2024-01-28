
function submitForm() {
    // Collect all input values dynamically
    var formData = {};
    var inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(function(input) {
        if (input.tagName === 'SELECT') {
            // For select elements, get the selected value
            formData[input.id] = input.options[input.selectedIndex].value;
        } else {
            // For other input types, get the value directly
            formData[input.id] = input.value;
        }
    });

    console.log('Form Data:', formData); // Log formData for debugging

    // Send data to the backend (AJAX, Fetch, etc.)
    fetch('/submit/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Handle success if needed
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle error if needed
    });
}

