# Agenda translations (FR, PT)

Rebuilds the French and Portuguese agenda PDFs on the layout of the English
Word agenda: the logos are copied from the English PDF, the title and table are
re-set in Liberation Serif (same metrics as Times New Roman).

    pip install pymupdf
    python3 build.py "WIRE 2026 Nairobi - Draft Agenda 29-10-2026.pdf" out/

Text lives in `content.py`. When the English agenda changes, update the EN, FR
and PT rows there, rebuild, and replace the files on the three agenda documents
in the Studio (Documents → Agenda). `out/WIRE_2026_Nairobi_Agenda_EN_rebuild_check.pdf`
is only for comparing the layout with the original; publish the original English PDF.
