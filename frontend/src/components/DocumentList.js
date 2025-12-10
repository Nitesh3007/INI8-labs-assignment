
const DocumentList = ({ docs, deleteFile }) => {
  return (
    <div className="docs-list">
      {docs.map((doc) => (
        <div className="doc-item" key={doc.id}>
          <span className="doc-name">{doc.filename}</span>

          <div className="actions">
            <a
              className="btn download-btn"
              href={`http://localhost:5000/documents/${doc.id}`}
              download
            >
              Download
            </a>

            <button
              className="btn delete-btn"
              onClick={() => deleteFile(doc.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {docs.length === 0 && (
        <p className="empty-text">No documents uploaded yet.</p>
      )}
    </div>
  );
};

export default DocumentList;