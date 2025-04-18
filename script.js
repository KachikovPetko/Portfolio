import config from './config.js';

// Language switching functionality
let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    updateContent();
    updateActiveLanguage();
    localStorage.setItem('preferred-language', lang);
}

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = key.split('.').reduce((obj, i) => obj[i], translations[currentLang]);
        if (translation) {
            element.textContent = translation;
        }
    });
}

function updateActiveLanguage() {
    document.querySelectorAll('.lang-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-lang') === currentLang) {
            link.classList.add('active');
        }
    });
}

// Event listeners for language switching
document.querySelectorAll('.lang-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const newLang = e.target.getAttribute('data-lang');
        setLanguage(newLang);
    });
});

// Initialize language from localStorage or default to English
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    setLanguage(savedLang);
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll to sections with centering
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const windowHeight = window.innerHeight;
            const sectionHeight = targetSection.offsetHeight;
            const offset = Math.max(0, (windowHeight - sectionHeight) / 2);
            
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Function to fetch GitHub projects
async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `token ${config.github.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        
        const projects = await response.json();
        return projects;
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        return [];
    }
}

// GitHub Projects Loading
async function loadGitHubProjects() {
    const projectsTrack = document.getElementById('projects-track');
    const username = 'KachikovPetko';
    const projectsPerPage = 10;
    
    try {
        const projects = await fetchGitHubProjects();
        
        if (!projects || projects.length === 0) {
            throw new Error('No projects found');
        }

        renderProjects(projects, projectsTrack);

    } catch (error) {
        console.error('Error loading projects:', error);
        projectsTrack.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p data-i18n="projects.error">${translations[currentLang].projects.error}</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;
    }
}

function renderProjects(projects, container) {
    // Clear loading state
    container.innerHTML = '';
    
    // Create project cards
    projects.forEach(project => {
        const card = createProjectCard(project);
        container.appendChild(card);
    });

    // Clone first few items for infinite scroll
    const itemsToClone = Math.min(3, projects.length);
    for (let i = 0; i < itemsToClone; i++) {
        const clone = container.children[i].cloneNode(true);
        container.appendChild(clone);
    }

    // Set up slider functionality
    let isTransitioning = false;
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;

    const prevButton = document.querySelector('.slider-nav.prev');
    const nextButton = document.querySelector('.slider-nav.next');

    function updateSliderPosition(index) {
        const cardWidth = container.firstElementChild.offsetWidth + 30; // width + gap
        container.style.transform = `translateX(-${index * cardWidth}px)`;
    }

    function handleTransitionEnd() {
        const cards = container.children;
        const cardWidth = cards[0].offsetWidth + 30;
        const scrollPosition = Math.abs(parseInt(container.style.transform.match(/-?\d+/)[0]));
        const currentIndex = Math.round(scrollPosition / cardWidth);

        if (currentIndex >= projects.length) {
            container.style.transition = 'none';
            updateSliderPosition(0);
            setTimeout(() => {
                container.style.transition = 'transform 0.5s ease';
            }, 10);
        } else if (currentIndex === 0) {
            container.style.transition = 'none';
            updateSliderPosition(projects.length);
            setTimeout(() => {
                container.style.transition = 'transform 0.5s ease';
            }, 10);
        }
        isTransitioning = false;
    }

    function moveToNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        const cards = container.children;
        const cardWidth = cards[0].offsetWidth + 30;
        const scrollPosition = Math.abs(parseInt(container.style.transform.match(/-?\d+/)[0]));
        const nextPosition = scrollPosition + cardWidth;
        container.style.transition = 'transform 0.5s ease';
        updateSliderPosition(nextPosition / cardWidth);
    }

    function moveToPrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        const cards = container.children;
        const cardWidth = cards[0].offsetWidth + 30;
        const scrollPosition = Math.abs(parseInt(container.style.transform.match(/-?\d+/)[0]));
        const prevPosition = scrollPosition - cardWidth;
        container.style.transition = 'transform 0.5s ease';
        updateSliderPosition(prevPosition / cardWidth);
    }

    // Event Listeners
    container.addEventListener('transitionend', handleTransitionEnd);
    nextButton.addEventListener('click', moveToNext);
    prevButton.addEventListener('click', moveToPrev);

    // Touch and mouse events for dragging
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        if (Math.abs(walk) > 50) {
            if (walk > 0) {
                moveToPrev();
            } else {
                moveToNext();
            }
            isDragging = false;
        }
    });

    // Initialize position
    updateSliderPosition(1);
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
        <div class="project-content">
            <h3>${project.name}</h3>
            <p>${project.description || translations[currentLang].projects.noDescription}</p>
            <div class="project-tags">
                <span>${project.language || 'N/A'}</span>
            </div>
            <div class="project-links">
                <a href="${project.html_url}" target="_blank" aria-label="GitHub Repository">
                    <i class="fab fa-github"></i>
                </a>
                ${project.homepage ? `
                    <a href="${project.homepage}" target="_blank" aria-label="Live Demo">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Load projects when the page loads
document.addEventListener('DOMContentLoaded', loadGitHubProjects); 