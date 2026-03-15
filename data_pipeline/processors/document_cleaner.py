import re


def clean_text(text: str) -> str:
    """
    Basic document normalization layer.
    Future: HTML cleaning, markdown removal, etc.
    """

    if not text:
        return ""

    text = re.sub(r"\s+", " ", text)
    text = text.strip()

    return text