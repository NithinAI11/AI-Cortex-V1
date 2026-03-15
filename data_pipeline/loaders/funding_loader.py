import csv


def load_funding_data(path):

    records = []

    with open(path, encoding="utf-8") as f:

        reader = csv.DictReader(f)

        for row in reader:

            records.append({
                "title": row.get("company", ""),
                "content": row.get("description", ""),
                "source": "funding"
            })

    return records