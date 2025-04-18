# PK Portfolio

A modern, responsive portfolio website showcasing my skills, projects, and professional experience. Built with HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Multilingual Support**: Available in English, Bulgarian, and German
- **Dynamic Content**: GitHub projects loaded dynamically via GitHub API
- **Modern UI**: Clean, professional design with smooth animations
- **Accessibility**: Built with accessibility in mind
- **Performance**: Optimized for fast loading and smooth interactions

## Technologies Used

- HTML5
- CSS3 (with CSS variables for theming)
- JavaScript (ES6+)
- Bootstrap Icons
- GitHub API

## Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── translations.js     # Multilingual support
└── README.md           # Project documentation
```

## Key Features

### Multilingual Support
The portfolio supports three languages:
- English (default)
- Bulgarian
- German

Language switching is handled through the `translations.js` file and JavaScript.

### Dynamic GitHub Projects
Projects are loaded dynamically from your GitHub profile using the GitHub API. This ensures your portfolio always shows your latest work.

### Responsive Design
The portfolio is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

### Skills Showcase
Your skills are organized into categories:
- Programming Languages
- Frameworks
- Tools

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/portfolio.git
   ```

2. Open `index.html` in your browser to view the portfolio.

3. To customize:
   - Edit `index.html` for content changes
   - Modify `styles.css` for styling
   - Update `translations.js` for language changes
   - Edit `script.js` for functionality changes

## Customization

### Changing Colors
The color scheme can be modified in the CSS variables at the top of `styles.css`:

```css
:root {
    --color-moss: #2C3424;
    --color-cypress: #4C583E;
    --color-olive: #768064;
    --color-cedar: #959581;
    --color-aloe: #DADED8;
    --color-white: #ffffff;
}
```

### Adding Languages
To add a new language:
1. Add a new language object in `translations.js`
2. Add a language selector in the navigation
3. Update the language switching logic in `script.js`

### Updating Projects
Projects are loaded from your GitHub profile. To change which projects are displayed, modify the GitHub API call in `script.js`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Performance

The portfolio is optimized for performance:
- Minimal JavaScript
- Optimized CSS
- Efficient asset loading
- Responsive images

## Accessibility

Built with accessibility in mind:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- High contrast text
- Screen reader compatibility

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- LinkedIn: [Petko Kachikov](https://bg.linkedin.com/in/petko-kachikov-a7a072263)
- X (Twitter): [@PKachikov](https://x.com/PKachikov)
- Instagram: [@petkokachikov](https://www.instagram.com/petkokachikov/)
- Email: kachikovpetko@gmail.com
- GitHub: [Your GitHub Profile]

## Acknowledgments

- Bootstrap Icons for the icon set
- Google Fonts for typography
- GitHub API for project data 