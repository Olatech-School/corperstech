# CorpersTech PDF Export Report

## 1. Printable View Compilation Engine

The platform provides a dedicated, styled print compile utility that does not rely on third-party server-side PDF generation tools (which frequently fail in sandboxed container environments). 

### Compilation Workflow
1. The client selects "Print Guide" or "Download PDF".
2. The component launches a clean, temporary `_blank` browser window.
3. It writes a beautifully styled, print-optimized HTML page containing the document title, metadata, and body.
4. It calls `window.print()` immediately after load.
5. This prompts the user's native system print menu, allowing them to:
   - Save directly as a **PDF document** with professional margins.
   - Dispatch to a **physical printer** for paper-bound handbooks.

---

## 2. Offline Downloads

For staff working in remote NYSC orientation camps with spotty internet connectivity:
- **Download Offline Copy**: Downloads a clean `.md` Markdown file of the document content to local storage with a single click.
- **Self-Contained Styling**: The downloaded file includes full YAML headers for offline indexing.
- **Zero Dependencies**: These downloads operate natively in the browser without any API server load.
