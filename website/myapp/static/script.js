
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
    .then(locations => updateContent(locations))
    .catch(error => console.error('Error fetching data:', error));
}
function updateContent(locations) {
            var locationContainer = document.getElementById('location-container');
            locationContainer.innerHTML = '';  // Clear existing content
            const locList= Object.values(locations);
            locList.forEach(function (location, index) {
                var subRectangle = document.createElement('div');
                subRectangle.className = 'sub-rectangle';
                subRectangle.style.backgroundImage = 'url("' + location.image_url + '")';

                var h2 = document.createElement('h2');
                h2.textContent = location.name;

                var p = document.createElement('p');
                p.textContent = location.town_city_area;

                subRectangle.appendChild(h2);
                subRectangle.appendChild(p);
                locationContainer.appendChild(subRectangle);
            });
        }

