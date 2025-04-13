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

// GitHub Projects Loading
async function loadGitHubProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const username = 'KachikovPetko';

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        const projects = await response.json();

        // Clear loading message
        projectsGrid.innerHTML = '';

        // Display projects
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            // Get languages for the project
            fetch(`https://api.github.com/repos/${username}/${project.name}/languages`)
                .then(response => response.json())
                .then(languages => {
                    const languageTags = Object.keys(languages).slice(0, 3);
                    
                    projectCard.innerHTML = `
                        <div class="project-content">
                            <h3>${project.name}</h3>
                            <p>${project.description || (translations[currentLang] ? translations[currentLang].projects.noDescription : 'No description available')}</p>
                            <div class="project-tags">
                                ${languageTags.map(lang => `<span>${lang}</span>`).join('')}
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
                            <div class="project-stats">
                                <span><i class="fas fa-star"></i> ${project.stargazers_count}</span>
                                <span><i class="fas fa-code-branch"></i> ${project.forks_count}</span>
                            </div>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error('Error fetching languages:', error);
                });
            
            projectsGrid.appendChild(projectCard);
        });
    } catch (error) {
        projectsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${translations[currentLang] ? translations[currentLang].projects.error : 'Failed to load projects. Please try again later.'}</p>
            </div>
        `;
        console.error('Error loading GitHub projects:', error);
    }
}

// Load projects when the page loads
document.addEventListener('DOMContentLoaded', loadGitHubProjects); 