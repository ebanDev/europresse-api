const serverUrl = "https://europresse-api.eban.eu.org";

async function request(endpoint: string, data: any) {
    const response = await fetch(`${serverUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}

async function login(username: string, password: string, provider: string, ent: string) {
    return await request('login', { username, password, provider, ent });
}

async function search(query: string, cookies: any) {
    return await request('search', { query, cookies });
}

async function getArticle(id: string, cookies: any) {
    return await request('article', { id, cookies });
}