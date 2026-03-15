from datetime import datetime


def build_metadata(doc: dict) -> dict:

    metadata = {
        "title": doc.get("title"),
        "source": doc.get("source"),
        "ingested_at": datetime.utcnow().isoformat(),
    }

    return metadata