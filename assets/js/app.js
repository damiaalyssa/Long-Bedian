/*
  This file contains the JavaScript for the multi-page website.
  It includes:
  1. Mobile menu toggle logic.
  2. "Fake" contact form submission logic for contact.html.
*/

window.onload = function() {
    
    // --- Mobile menu toggle logic ---
    const menuButton = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    
    if (menuButton && menu) {
        menuButton.addEventListener('click', function() {
            menu.classList.toggle('hidden');
        });
    }

    // --- Mobile menu link click logic ---
    // Close the mobile menu when any link inside it is clicked
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    if (menu && mobileLinks.length > 0) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }

    // --- Contact form submission logic ---
    // This will only run on contact.html because the elements only exist there
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    
    if (contactForm && contactSuccess) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop the form from actually submitting
            
            // Hide the form and show the success message
            contactForm.classList.add('hidden');
            contactSuccess.classList.remove('hidden');
            
            // Add fade-in class to the success message
            // Note: 'page-fade-in' class is defined in styles.css
            contactSuccess.classList.add('page-fade-in'); 
        });
    }
};