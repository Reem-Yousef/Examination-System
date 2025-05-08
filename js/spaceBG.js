document.addEventListener('DOMContentLoaded', () => {

// stars apply

const starsContainer = document.querySelector('.stars');

Array.from({ length: 500 }).forEach(() => {
    const star = document.createElement('div');
    star.classList.add('star');

    // Randomly assign white or pink stars
    if (Math.random() > 0.3) {
        star.classList.add('star-white');
    } else {
        star.classList.add('star-pink');
    }

    const size = `${Math.random() * 2 + 1}px`;
    Object.assign(star.style, {
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`
    });

    starsContainer.appendChild(star);
});

//create meteors

const createMeteor = () => {
    const meteor = document.createElement('div');
    meteor.classList.add('meteor');

    const left = Math.random() * window.innerWidth * 0.7; 
    const top = Math.random() * window.innerHeight * 0.4;

    meteor.style.left = `${left}px`;
    meteor.style.top = `${top}px`;

    document.body.appendChild(meteor);

    setTimeout(() => meteor.remove(), 1000);
};

    setInterval(() => {
        if (Math.random() < 0.8) createMeteor();
    }, 2500);

});
