
function submitForm() {
    // Collect all input values dynamically
    //var locationContainer = document.getElementById('location-container');
      //      locationContainer.innerHTML = '';  // Clear existing content
    startBuffering();

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
    .then(result => {sessionStorage.setItem('user', JSON.stringify(formData));
})
            .catch(error => console.error('Error fetching data:', error));
    }
    else{
        document.getElementById('location').placeholder="Please Enter Location!";
    }
}
var locationsToSend;

function updateContent(locations) {
            stopBuffering();
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

let usr;
function inBefore(parent, elem,childParent){
    parent.insertBefore(elem, childParent);
}
async function addInfo(request,location, elementType,parent,before,useBefore){
    fetch('/info/', {
        method: 'POST',
        headers: {
            'Content-Type': 'text',
        },
        body: "User Data to take into account: "+usr+" Request: "+request+" "+location.name+" "+location.area,
    })
    .then(response => response.json())
            
    .then(result => {
        var elem=document.createElement(elementType);
        elem.textContent=result.result;
        parent.appendChild(elem);
        if(useBefore==true){
            parent.insertBefore(elem, before);
            console.log(parent.firstChild);
        }
        return elem;
    })
}

function addHeader(request,parent){
    var h3 = document.createElement('h3');
    h3.textContent = request;
    parent.appendChild(h3);
    return h3;
}
window.onload = function() {
    
    if(window.location.href.includes("results")){
        const locations = JSON.parse(sessionStorage.getItem('locations'));
        usr = sessionStorage.getItem('user');
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
                    addInfo(" describe in 3 words, ", location, "h3",result_col,result_col.firstChild,true);
                    addHeader("About",result_col);
                    
                    var x=addHeader("Best Visiting Time",result_col);
                    addInfo(" Generate a short, comprehensive, and user-friendly max 2 sentences description for , ", location, "g",result_col,x,true);
                    
                    var z=addHeader("Activities",result_col);
                    addInfo("keep your whole answer 3 sentences MAX. Recommend the best time of year to visit for ", location, "g",result_col,z,true);
                    var hz=addHeader("Safety / Tips",result_col);
                    addInfo("keep your whole answer 3 sentences MAX. List 1-3 must-try activities for ", location, "g",result_col,hz,true);
                    var hl=addHeader("Itinerary",result_col);
                    addInfo("Provide some tips/information to be prepared for each activity at [Desired Location]. keep your whole answer 3 sentences MAX. Location: ", location, "g",result_col,hl,true);

                    addInfo("Considering the users previous accessibility requirements and preferences, create a very summarized itinerary for an adventure here. Make sure to be very considerate of individuals disabilities or preferences. keep your whole answer 3 sentences MAX. Location:  ", location, "g",result_col,parent.lastChild,false);

                    /*Recommend the best time of year to visit for*/
                    /*
                    addInfo("", location, "g",result_col,false);
                    */
            }

        }
    }
    else{
        stopBuffering();
    }
};
function startBuffering() {
            var bufferingCircle = document.getElementById('bufferingCircle');
            bufferingCircle.classList.remove('buffering-hide');
        }

        function stopBuffering() {
            var bufferingCircle = document.getElementById('bufferingCircle');
            bufferingCircle.classList.add('buffering-hide');
        }
