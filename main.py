import sys

from data_pipeline.ingest import run_ingestion
from orchestration.graph import build_graph


def ask(query):

    graph = build_graph()

    result = graph.invoke({"query": query})

    print("\n----- ANSWER -----\n")

    print(result["answer"])

    print("\nSources:")

    for s in result["sources"]:
        print(f"- {s}")

    print("\n------------------\n")


def main():

    if len(sys.argv) < 2:

        print("""
Commands:

py -m main ingest
py -m main ask "your question"
""")

        return

    cmd = sys.argv[1]

    if cmd == "ingest":

        run_ingestion()

    elif cmd == "ask":

        query = " ".join(sys.argv[2:])

        ask(query)

    else:

        print("Unknown command")


if __name__ == "__main__":
    main()