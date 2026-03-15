import requests


def fetch_ai_repos():

    url = "https://api.github.com/search/repositories"

    params = {
        "q": "topic:artificial-intelligence",
        "sort": "stars",
        "order": "desc",
        "per_page": 20
    }

    r = requests.get(url, params=params)

    repos = []

    for repo in r.json()["items"]:

        repos.append({
            "title": repo["name"],
            "content": repo["description"] or "",
            "source": "github"
        })

    return repos