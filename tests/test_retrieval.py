from rag.retriever import Retriever

def run_test():

    retriever = Retriever()

    query = "recent AI innovations"

    results = retriever.search(query)

    for r in results:
        print(r)

if __name__ == "__main__":
    run_test()