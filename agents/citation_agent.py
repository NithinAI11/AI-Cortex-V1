from core.logger import logger


class CitationAgent:

    """
    Formats source references for responses.
    """

    def build_sources(self, docs):

        sources = []

        for d in docs:

            source = f"{d.get('title')} ({d.get('source')})"

            sources.append(source)

        unique = list(set(sources))

        logger.info("CitationAgent generated sources")

        return unique