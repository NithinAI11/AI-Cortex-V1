import logging


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger("AI-CORTEX")


def log(message: str):
    """
    Backward compatible logging wrapper
    used by older modules.
    """
    logger.info(message)