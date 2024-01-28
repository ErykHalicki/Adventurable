
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
    if(formData["location"]!=''){
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
    else{
        document.getElementById('location').placeholder="Please Enter Location!";
    }
}
var locationsToSend;

function updateContent(locations) {
            var locationContainer = document.getElementById('location-container');
            locationContainer.innerHTML = '';  // Clear existing content
            locationsToSend=locations;
            for (let id in locations) {
                if (locations.hasOwnProperty(id)) {
                    const location = locations[id];
                    var subRectangle = document.createElement('div');
                    subRectangle.className = 'sub-rectangle';
                    subRectangle.style.backgroundImage = 'url("' + location.image_url + '.jpg")';

                    console.log("changed image!");
                    var h2 = document.createElement('h2');
                    h2.textContent = location.name;

                    var m = document.createElement('m');
                    m.textContent = location.area;

                    subRectangle.appendChild(h2);
                    subRectangle.appendChild(m);
                    locationContainer.appendChild(subRectangle);
                }
            }
        sessionStorage.setItem('locations', JSON.stringify(locations));
        var button = document.createElement('button');
        button.className="proceed-button";
        button.addEventListener('click', function() {
            window.location.href = 'results';  // Replace with the desired URL
            event.preventDefault();
                });        
    button.textContent="Proceed";
        locationContainer.appendChild(button);
}
function redirectToNewPage() {
        window.location.href = '/results';  
    }
function showAccessibilityInput() {
            var accessibilitySelect = document.getElementById("accessibility");
            var accessibilityOtherInput = document.getElementById("accessibilityDescription");

            if (accessibilitySelect.value === "Yes") {
                accessibilityOtherInput.style.display = "block";
            } else {
                accessibilityOtherInput.style.display = "none";
            }
        }

async function addInfo(request,location, elementType,parent,before){
    fetch('/info/', {
        method: 'POST',
        headers: {
            'Content-Type': 'text',
        },
        body: request+" "+location.name+" "+location.area,
    })
    .then(response => response.json())
            
    .then(result => {
        var elem=document.createElement(elementType);
        elem.textContent=result.result;
        if(before==true){
            parent.insertBefore(elem, parent.FirstChild);
        }
        else {
        parent.insertBefore(elem, parent.LastChild.nextSibling);
    }
    })
}
window.onload = function() {
    if(window.location.href.includes("results")){
        const locations = JSON.parse(sessionStorage.getItem('locations'));
        console.log("got data!");
        var locationContainer = document.getElementById('location-container');
            locationContainer.innerHTML = '';  // Clear existing content
            for (let id in locations) {
                if (locations.hasOwnProperty(id)) {
                    const location = locations[id];
                    var result_col=document.createElement('div');
                    result_col.className="result-column";
                    var subRectangle = document.createElement('div');
                    subRectangle.className = 'sub-rectangle';
                    subRectangle.style.backgroundImage = 'url("' + location.image_url + '.jpg")';
                    var h2 = document.createElement('h2');
                    h2.textContent = location.name;
                    var m = document.createElement('m');
                    m.textContent = location.area;
                    subRectangle.appendChild(h2);
                    subRectangle.appendChild(m);
                    result_col.appendChild(subRectangle);
                    locationContainer.appendChild(result_col);
                    addInfo(" describe in 3 words, ", location, "h1",result_col);
                    addInfo(" describe in 2 sentences, ", location, "g",result_col);
                    /*result_col.appendChild(h2);*/
            }
        }
    }
};
