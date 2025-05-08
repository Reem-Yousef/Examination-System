 // Create stars
 document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.querySelector('.stars');
       
    // Add celebration particles for success page
    const successContainer = document.getElementById('success');
    
    function createParticles() {
        if (successContainer.style.display === 'none') return;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random position within the success container
                const x = Math.random() * successContainer.offsetWidth;
                const y = Math.random() * successContainer.offsetHeight;
                
                // Pink theme colors
                const colors = ['#ff36a3', '#ffadd2', '#ff00ff', '#b5338a', '#ffffff'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // Set styles
                Object.assign(particle.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                    backgroundColor: color,
                    animation: `float-up ${1 + Math.random() * 2}s linear forwards`,
                    animationDelay: `${Math.random() * 0.5}s`
                });
                
                successContainer.appendChild(particle);
                
                // Remove particle after animation completes
                setTimeout(() => {
                    particle.remove();
                }, 3000);
            }, i * 100);
        }
    }

    // Create particles periodically when success page is visible
    setInterval(createParticles, 500);
});

// Function to switch between pages
// function showPage(pageId) {
//     // Hide all pages
//     document.getElementById('timeout').style.display = 'none';
//     document.getElementById('success').style.display = 'none';
//     document.getElementById('failure').style.display = 'none';
    
//     // Show selected page
//     document.getElementById(pageId).style.display = 'block';
// }