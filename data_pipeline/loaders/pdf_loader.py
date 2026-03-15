# ===== File: data_pipeline/loaders/pdf_loader.py =====
import pdfplumber
from pathlib import Path
from core.logger import log

def load_pdfs(folder_path):
    docs =[]
    folder = Path(folder_path)
    if not folder.exists():
        return docs

    for pdf_file in folder.glob("*.pdf"):
        log(f"Deep parsing PDF: {pdf_file.name}")
        text_content = ""
        
        try:
            with pdfplumber.open(pdf_file) as pdf:
                for page in pdf.pages:
                    # Extract standard text
                    extracted = page.extract_text()
                    if extracted:
                        text_content += extracted + "\n\n"
                    
                    # Extract embedded Tables!
                    tables = page.extract_tables()
                    for table in tables:
                        text_content += "--- DATA TABLE START ---\n"
                        for row in table:
                            # Clean empty cells
                            cleaned_row =[str(c).replace('\n', ' ') if c else "N/A" for c in row]
                            text_content += " | ".join(cleaned_row) + "\n"
                        text_content += "--- DATA TABLE END ---\n\n"

            docs.append({
                "title": pdf_file.name,
                "content": text_content,
                "source": "pdf"
            })
        except Exception as e:
            log(f"Failed to parse {pdf_file.name}: {e}")

    return docs