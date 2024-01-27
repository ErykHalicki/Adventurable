function submitForm() {
    // Collect all input values dynamically
    var formData = {};
    var inputs = document.querySelectorAll('input');
    inputs.forEach(function(input) {
        formData[input.id] = input.value;
    });

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
