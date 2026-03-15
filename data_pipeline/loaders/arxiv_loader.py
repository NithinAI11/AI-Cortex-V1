import requests
import xml.etree.ElementTree as ET


ARXIV_API = "http://export.arxiv.org/api/query"


def fetch_ai_papers(max_results=20):

    params = {
        "search_query": "cat:cs.AI",
        "start": 0,
        "max_results": max_results
    }

    r = requests.get(ARXIV_API, params=params)

    root = ET.fromstring(r.text)

    ns = {"a": "http://www.w3.org/2005/Atom"}

    papers = []

    for entry in root.findall("a:entry", ns):

        title = entry.find("a:title", ns).text
        summary = entry.find("a:summary", ns).text

        papers.append({
            "title": title.strip(),
            "content": summary.strip(),
            "source": "arxiv"
        })

    return papers