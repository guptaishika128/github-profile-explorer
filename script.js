document.getElementById('search-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        fetchUserProfile(username);
        fetchUserRepositories(username);
    } else {
        alert("Please enter a GitHub username.");
    }
});

function fetchUserProfile(username) {
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`User not found: ${username}`);
            }
            return response.json();
        })
        .then(data => {
            displayUserProfile(data);
        })
        .catch(error => {
            document.getElementById('profile').innerHTML = `<p class="error">${error.message}</p>`;
            document.getElementById('repositories').innerHTML = '';
        });
}

function displayUserProfile(data) {
    const profileElement = document.getElementById('profile');
    profileElement.innerHTML = `
        <div class="profile-card">
            <img src="${data.avatar_url}" alt="${data.login}" width="100" height="100">
            <div>
                <h2>${data.name || data.login}</h2>
                <p>${data.bio || ''}</p>
                <p><strong>Followers:</strong> ${data.followers}</p>
                <p><strong>Following:</strong> ${data.following}</p>
                <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                <p><strong>Location:</strong> ${data.location || 'Not specified'}</p>
                <p><strong>Company:</strong> ${data.company || 'Not specified'}</p>
                <p><strong>Blog:</strong> <a href="${data.blog}" target="_blank">${data.blog || 'Not specified'}</a></p>
            </div>
        </div>
    `;
}

function fetchUserRepositories(username) {
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Repositories not found for user: ${username}`);
            }
            return response.json();
        })
        .then(data => {
            displayUserRepositories(data);
        })
        .catch(error => {
            document.getElementById('repositories').innerHTML = `<p class="error">${error.message}</p>`;
        });
}

function displayUserRepositories(repositories) {
    const repositoriesElement = document.getElementById('repositories');
    if (repositories.length === 0) {
        repositoriesElement.innerHTML = '<p>No repositories found.</p>';
        return;
    }

    repositoriesElement.innerHTML = repositories.map(repo => `
        <div class="repository-card">
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description || 'No description provided'}</p>
            <p><strong>Stars:</strong> ${repo.stargazers_count}</p>
            <p><strong>Forks:</strong> ${repo.forks_count}</p>
            <p><strong>Language:</strong> ${repo.language || 'Not specified'}</p>
            <p><strong>Updated:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</p>
        </div>
    `).join('');
}
