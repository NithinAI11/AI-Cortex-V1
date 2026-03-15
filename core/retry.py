import time
import logging


def retry(max_attempts=3, delay=1):

    def decorator(func):

        def wrapper(*args, **kwargs):

            attempt = 0

            while attempt < max_attempts:

                try:
                    return func(*args, **kwargs)

                except Exception as e:

                    attempt += 1

                    logging.error(
                        f"{func.__name__} failed attempt {attempt}: {str(e)}"
                    )

                    if attempt == max_attempts:
                        raise

                    time.sleep(delay)

        return wrapper

    return decorator