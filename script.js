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
    // Load projects after language is set
    loadGitHubProjects();
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
    const username = 'KachikovPetko';
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const projects = await response.json();
        return projects;
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        throw error;
    }
}

// GitHub Projects Loading
async function loadGitHubProjects() {
    const projectsTrack = document.getElementById('projects-track');
    
    // Show loading state
    projectsTrack.innerHTML = `
        <div class="loading">
            <i class="bi bi-arrow-repeat"></i>
            <p>Loading projects...</p>
        </div>
    `;
    
    try {
        const projects = await fetchGitHubProjects();
        
        if (!projects || projects.length === 0) {
            throw new Error('No projects found');
        }

        await renderProjects(projects, projectsTrack);

    } catch (error) {
        console.error('Error loading projects:', error);
        projectsTrack.innerHTML = `
            <div class="error-message">
                <p>Failed to load projects. Please try again later.</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;
    }
}

async function fetchRepoLanguages(languagesUrl) {
    try {
        const response = await fetch(languagesUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch languages');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching languages:', error);
        return {};
    }
}

function calculateLanguagePercentages(languages) {
    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    return Object.entries(languages).map(([name, bytes]) => ({
        name,
        percentage: ((bytes / total) * 100).toFixed(1)
    })).sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
}

function getLanguageIcon(language) {
    // Map languages to their corresponding Bootstrap icons
    const iconMap = {
        JavaScript: 'bi-filetype-js',
        TypeScript: 'bi-filetype-tsx',
        Python: 'bi-filetype-py',
        Java: 'bi-filetype-java',
        'C#': 'bi-filetype-cs',
        'C++': 'bi-filetype-cpp',
        C: 'bi-filetype-c',
        HTML: 'bi-filetype-html',
        CSS: 'bi-filetype-css',
        Ruby: 'bi-filetype-rb',
        PHP: 'bi-filetype-php',
        Swift: 'bi-filetype-swift',
        Go: 'bi-filetype-go',
        SQL: 'bi-filetype-sql',
        Shell: 'bi-terminal',
        PowerShell: 'bi-terminal',
        Dockerfile: 'bi-docker',
        Rust: 'bi-gear',
        SCSS: 'bi-filetype-sass',
        Vue: 'bi-code-slash',
        React: 'bi-code-slash',
        Angular: 'bi-code-slash',
        // Add more mappings as needed
    };

    return iconMap[language] || 'bi-code-slash'; // Default icon if language not found
}

function createLanguageTag(language) {
    return `<span class="language-tag" title="${language}">
        <i class="bi ${getLanguageIcon(language)}"></i>
        ${language}
    </span>`;
}

async function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const description = project.description || 'No description available';
    
    // Fetch languages for this repository
    const languages = await fetchRepoLanguages(project.languages_url);
    const languagesHtml = Object.keys(languages)
        .map(lang => createLanguageTag(lang))
        .join('');
    
    card.innerHTML = `
        <div class="project-content">
            <h3>${project.name}</h3>
            <p class="project-description">${description}</p>
            <div class="project-footer">
                <div class="project-tags">
                    ${languagesHtml}
                </div>
                <div class="project-links">
                    <a href="${project.html_url}" target="_blank" aria-label="GitHub Repository">
                        <i class="bi bi-github"></i>
                    </a>
                    ${project.homepage ? `
                        <a href="${project.homepage}" target="_blank" aria-label="Live Demo">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Update renderProjects to handle async card creation
async function renderProjects(projects, container) {
    // Clear loading state
    container.innerHTML = '';
    
    // Create project cards
    for (const project of projects) {
        if (!project.fork) { // Only show non-forked projects
            const card = await createProjectCard(project);
            container.appendChild(card);
        }
    }

    // Clone first few items for infinite scroll
    const itemsToClone = Math.min(3, container.children.length);
    for (let i = 0; i < itemsToClone; i++) {
        const clone = container.children[i].cloneNode(true);
        container.appendChild(clone);
    }

    initializeSlider(container);
}

function initializeSlider(container) {
    let isTransitioning = false;
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;

    const prevButton = document.querySelector('.slider-nav.prev');
    const nextButton = document.querySelector('.slider-nav.next');

    if (!prevButton || !nextButton) return;

    function updateSliderPosition(index) {
        const cardWidth = container.firstElementChild?.offsetWidth + 30 || 0; // width + gap
        container.style.transform = `translateX(-${index * cardWidth}px)`;
    }

    function handleTransitionEnd() {
        if (!container.firstElementChild) return;
        
        const cardWidth = container.firstElementChild.offsetWidth + 30;
        const scrollPosition = Math.abs(parseInt(container.style.transform.match(/-?\d+/)?.[0] || '0'));
        const currentIndex = Math.round(scrollPosition / cardWidth);
        const totalProjects = container.children.length;

        if (currentIndex >= totalProjects - 3) {
            container.style.transition = 'none';
            updateSliderPosition(0);
            setTimeout(() => {
                container.style.transition = 'transform 0.5s ease';
            }, 10);
        } else if (currentIndex === 0) {
            container.style.transition = 'none';
            updateSliderPosition(totalProjects - 4);
            setTimeout(() => {
                container.style.transition = 'transform 0.5s ease';
            }, 10);
        }
        isTransitioning = false;
    }

    function moveToNext() {
        if (isTransitioning || !container.firstElementChild) return;
        isTransitioning = true;
        const cardWidth = container.firstElementChild.offsetWidth + 30;
        const scrollPosition = Math.abs(parseInt(container.style.transform.match(/-?\d+/)?.[0] || '0'));
        const nextPosition = scrollPosition + cardWidth;
        container.style.transition = 'transform 0.5s ease';
        updateSliderPosition(nextPosition / cardWidth);
    }

    function moveToPrev() {
        if (isTransitioning || !container.firstElementChild) return;
        isTransitioning = true;
        const cardWidth = container.firstElementChild.offsetWidth + 30;
        const scrollPosition = Math.abs(parseInt(container.style.transform.match(/-?\d+/)?.[0] || '0'));
        const prevPosition = scrollPosition - cardWidth;
        container.style.transition = 'transform 0.5s ease';
        updateSliderPosition(prevPosition / cardWidth);
    }

    // Event Listeners
    container.addEventListener('transitionend', handleTransitionEnd);
    nextButton.addEventListener('click', moveToNext);
    prevButton.addEventListener('click', moveToPrev);

    // Initialize position
    updateSliderPosition(0);
} 