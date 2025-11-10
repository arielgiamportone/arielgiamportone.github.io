document.addEventListener('DOMContentLoaded', function() {
    const logos = document.querySelectorAll('.school-logo');
    logos.forEach(logo => {
        logo.style.width = '60px';
        logo.style.height = '60px';
        logo.style.maxWidth = '60px';
        logo.style.maxHeight = '60px';
        logo.style.objectFit = 'contain';
    });
});