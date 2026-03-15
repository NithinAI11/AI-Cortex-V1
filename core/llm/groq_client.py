# ===== File: core/llm/groq_client.py =====
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class GroqLLM:
    """
    Production-ready LLM wrapper with streaming capabilities.
    """
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not set")
        self.client = Groq(api_key=api_key)
        self.models =["llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"]

    def generate(self, prompt, stream=False, callback=None):
        last_error = None
        for model in self.models:
            try:
                if stream:
                    response = self.client.chat.completions.create(
                        model=model,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.2,
                        stream=True
                    )
                    full_text = ""
                    for chunk in response:
                        token = chunk.choices[0].delta.content
                        if token:
                            full_text += token
                            if callback:
                                callback(token)
                    return full_text
                else:
                    response = self.client.chat.completions.create(
                        model=model,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.2
                    )
                    return response.choices[0].message.content
            except Exception as e:
                print(f"Model {model} failed, trying fallback...")
                last_error = e
        raise last_error