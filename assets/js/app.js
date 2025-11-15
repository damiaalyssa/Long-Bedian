/*
  This file contains the JavaScript for the multi-page website.
  It includes:
  1. Mobile menu toggle logic.
  2. REAL contact form submission logic for contact.html.
  3. REAL homestay data fetching for explore.html with Google Maps.
*/

// --- 1. PASTE YOUR WEB APP URL HERE ---
// This *same* URL is used for both the contact form (POST) and homestays (GET)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSpiq6cFEgp2y1g1kXgZ141ePha9F5J-AvKEfZxFH6ZXJT_72b2CtbQandDOZCK64JVg/exec"; 
// e.g., "https://script.google.com/macros/s/ABC.../exec"


// --- Main startup function ---
window.onload = function() {
    initMobileMenu();
    initContactForm();
    initExplorePage();
};

// --- 1. Mobile Menu Logic ---
function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    
    if (menuButton && menu) {
        menuButton.addEventListener('click', function() {
            menu.classList.toggle('hidden');
        });
    }

    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    if (menu && mobileLinks.length > 0) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }
}

// --- 2. Contact Form Logic ---
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return; // Only run if we are on the contact page

    const contactSuccess = document.getElementById('contact-success');
    const contactError = document.getElementById('contact-error');
    const submitButton = document.getElementById('submit-button');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        submitText.classList.add('hidden');
        submitLoading.classList.remove('hidden');
        submitButton.disabled = true;
        contactError.classList.add('hidden');

        const formData = new FormData(contactForm);

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                contactForm.classList.add('hidden');
                contactSuccess.classList.remove('hidden');
                contactSuccess.classList.add('page-fade-in');
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            contactError.classList.remove('hidden'); 
            contactError.classList.add('page-fade-in');
            
            submitText.classList.remove('hidden');
            submitLoading.classList.add('hidden');
            submitButton.disabled = false;
        });
    });
}

// --- 3. Explore Page (Homestay) Logic ---
function initExplorePage() {
    const container = document.getElementById('homestay-container');
    if (!container) return; // Only run if we are on the explore page

    const loading = document.getElementById('homestay-loading');
    const error = document.getElementById('homestay-error');

    // Fetch data from our Google Script (using the default GET method)
    fetch(SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                // Clear the container
                container.innerHTML = '';
                
                // Check if there are any homestays
                if (data.homestays.length === 0) {
                     container.innerHTML = '<p class="text-gray-500">No homestays are listed at this time. Please check back later.</p>';
                }

                // Loop through each homestay and build an HTML card with Google Maps
                data.homestays.forEach(homestay => {
                    // Process the location to handle different formats
                    let embedUrl = '';
                    const locationData = homestay.Location || homestay.Name + ', Long Bedian, Sarawak, Malaysia';
                    
                    // Check if it's a Google Maps link
                    if (locationData.includes('google.com/maps') || locationData.includes('goo.gl/maps')) {
                        // Extract coordinates or place ID from Google Maps URL
                        const coordMatch = locationData.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                        const placeMatch = locationData.match(/place\/([^\/]+)/);
                        
                        if (coordMatch) {
                            // Found coordinates in the URL
                            embedUrl = `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                        } else if (placeMatch) {
                            // Found place name in the URL
                            embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')))}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                        } else {
                            // Can't parse the URL, use the whole thing as search query
                            embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationData)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                        }
                    } else {
                        // It's a regular address or coordinates
                        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationData)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                    }
                    
                    const card = `
                        <div class="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-primary-green/20">
                            <!-- Google Maps Embed (No API Key Required) -->
                            <div class="w-full h-48">
                                <iframe 
                                    src="${embedUrl}"
                                    width="100%" 
                                    height="100%" 
                                    style="border:0;" 
                                    allowfullscreen="" 
                                    loading="lazy" 
                                    referrerpolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                            <div class="p-5">
                                <h3 class="text-xl font-semibold text-primary-green mb-2">${homestay.Name}</h3>
                                <p class="text-sm text-gray-600 mb-4">${homestay.Description}</p>
                                <div class="mt-auto">
                                    <p class="font-semibold text-gray-800">${homestay.Price}</p>
                                    <p class="text-sm text-gray-500">Contact: ${homestay.Contact}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    container.innerHTML += card;
                });

                // Hide loading spinner
                loading.classList.add('hidden');
            } else {
                // The script returned an error
                throw new Error(data.error || 'Could not fetch data');
            }
        })
        .catch(err => {
            console.error('Error fetching homestays:', err);
            // Show error message and hide loading
            loading.classList.add('hidden');
            error.classList.remove('hidden');
        });
}