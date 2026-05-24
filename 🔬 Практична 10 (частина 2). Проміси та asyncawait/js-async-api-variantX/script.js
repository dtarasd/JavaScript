const input = document.getElementById('username-input');
const btn = document.getElementById('search-btn');
const sortSelect = document.getElementById('sort-select');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error-msg');
const profile = document.getElementById('profile');
const repos = document.getElementById('repos');

const cache = new Map();

async function fetchGitHubData(username, sort) {
    try {
        // показую стан завантаження
        loading.classList.remove('hidden');
        errorMsg.classList.add('hidden');
        profile.classList.add('hidden');
        repos.classList.add('hidden');

        const cacheKey = username + '-' + sort;

        // перевіряю чи є дані в кеші
        if (cache.has(cacheKey)) {
            const data = cache.get(cacheKey);
            renderProfile(data.userData);
            renderRepos(data.reposData);
            loading.classList.add('hidden');
            return;
        }

        let reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
        if (sort === 'updated') {
            reposUrl += '&sort=updated';
        }

        // паралельно завантажую профіль та репозиторії
        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(reposUrl)
        ]);

        // обробка rate limit
        if (userRes.status === 403 || reposRes.status === 403) {
            throw new Error('Перевищено ліміт запитів до GitHub API (60 на годину). Спробуй пізніше.');
        }

        if (!userRes.ok) {
            throw new Error('Користувача не знайдено');
        }

        const userData = await userRes.json();
        let reposData = await reposRes.json();

        // локальне сортування для зірок та форків
        if (sort === 'stars') {
            reposData.sort((a, b) => b.stargazers_count - a.stargazers_count);
        } else if (sort === 'forks') {
            reposData.sort((a, b) => b.forks_count - a.forks_count);
        }

        // беру тільки топ 5
        reposData = reposData.slice(0, 5);

        // паралельно завантажую додаткові дані для кожного репозиторію
        reposData = await Promise.all(reposData.map(async (repo) => {
            const [contribRes, langRes, readmeRes] = await Promise.all([
                fetch(repo.contributors_url),
                fetch(repo.languages_url),
                // отримую README у вигляді звичайного тексту
                fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
                    headers: { 'Accept': 'application/vnd.github.v3.raw' }
                })
            ]);

            const contributors = contribRes.ok ? await contribRes.json() : [];
            const languages = langRes.ok ? await langRes.json() : {};

            let readmeText = 'Немає README';
            if (readmeRes.ok) {
                const text = await readmeRes.text();
                // беру тільки початок для прев'ю
                readmeText = text.substring(0, 100) + '...';
            }

            return {
                ...repo,
                topContributors: contributors.slice(0, 3),
                allLanguages: Object.keys(languages),
                readmePreview: readmeText
            };
        }));

        // зберігаю в кеш
        cache.set(cacheKey, { userData, reposData });

        renderProfile(userData);
        renderRepos(reposData);

    } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden');
    } finally {
        // ховаю напис завантаження
        loading.classList.add('hidden');
    }
}

function renderProfile(user) {
    profile.innerHTML = `
        <div class="profile-card">
            <img src="${user.avatar_url}" alt="${user.login}">
            <div>
                <h2>${user.name || user.login}</h2>
                <p>${user.bio || 'Немає опису'}</p>
                <div class="stats">
                    <span>Підписники: ${user.followers}</span>
                    <span>Репозиторії: ${user.public_repos}</span>
                </div>
            </div>
        </div>
    `;
    profile.classList.remove('hidden');
}

function renderRepos(reposList) {
    if (reposList.length === 0) {
        repos.innerHTML = '<p>Немає публічних репозиторіїв</p>';
    } else {
        const reposHtml = reposList.map(repo => {
            const contribsHtml = repo.topContributors.map(c => c.login).join(', ') || 'Немає';
            const langsHtml = repo.allLanguages.join(', ') || 'Не вказано';
            return `
            <div class="repo-card">
                <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
                <p>${repo.description || 'Немає опису'}</p>
                <p style="font-size: 0.9em; color: #666;">README: ${repo.readmePreview}</p>
                <div class="stats">
                    <span>Зірки: ${repo.stargazers_count}</span>
                    <span>Форки: ${repo.forks_count}</span>
                    <span>Мови: ${langsHtml}</span>
                    <span>Контриб'ютори: ${contribsHtml}</span>
                </div>
            </div>
            `;
        }).join('');
        repos.innerHTML = `<h3>Останні репозиторії:</h3>${reposHtml}`;
    }
    repos.classList.remove('hidden');
}

btn.addEventListener('click', () => {
    const username = input.value.trim();
    const sort = sortSelect.value;
    if (username) {
        fetchGitHubData(username, sort);
    }
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const username = input.value.trim();
        const sort = sortSelect.value;
        if (username) {
            fetchGitHubData(username, sort);
        }
    }
});