document.addEventListener("DOMContentLoaded", function() {
  const fadeInSections = document.querySelectorAll('.fade-in-section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');  // Remove the class when the section is out of view
      }
    });
  }, {
    threshold: 0.1  // Adjust this threshold to determine when the section should trigger
  });

  fadeInSections.forEach(section => {
    observer.observe(section);
  });
});
