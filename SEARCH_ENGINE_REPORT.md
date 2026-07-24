# CorpersTech Search Engine Report

## 1. Multi-Dimensional Search Algorithms

The CorpersTech search engine uses a comprehensive multi-criteria lookup engine to match search queries against documents. It is fully implemented to operate client-side in real-time, with background server telemetry recording keywords.

### Search Vector Criteria
The search matches the query string across multiple indices:
- **Title Match**: Direct title scan.
- **Content Match**: In-depth text scan of instructions.
- **Category Match**: Category classification search.
- **Tags Match**: Direct search matching comma-separated keywords and hashtags.
- **Role Visibility Match**: Filters by eligible viewer role.
- **Author Match**: Search by creator or editor.

---

## 2. Telemetry and Keyword Logging

The search engine is not just passive; it records search metrics in the MySQL/JSON fallback database via `/api/documents/search/record` using the `StaffDocumentSearchKeyword` model.

### Telemetry Pipeline
1. **Debounced Listener**: The React client listens to the search query with a 1.5-second debounce.
2. **REST Trigger**: If the query is 3 or more characters, it triggers a non-blocking `POST` request to `/api/documents/search/record`.
3. **Database Counter**: The backend checks if the keyword already exists for that category. If yes, it increments `count`; if no, it registers a new keyword record.
4. **Analytics Aggregation**: Super Admins can instantly view the top-searched terms on their dashboard to identify where staff are encountering friction.
