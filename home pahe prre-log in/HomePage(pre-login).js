// Scroll to features section when "Learn More" is clicked
document.querySelector('.btn.secondary').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
  });
  