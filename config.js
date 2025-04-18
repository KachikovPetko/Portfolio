// GitHub API Configuration
const config = {
    github: {
        // The token should be set as an environment variable
        // NEVER commit the actual token to the repository
        token: process.env.GITHUB_TOKEN || '',
        username: 'KachikovPetko',
        // Add other configuration options here
    }
};

export default config; 