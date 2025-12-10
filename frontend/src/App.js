import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import DocumentList from "./components/DocumentList";
import UploadBox from "./components/UploadBox";

function App() {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch documents
  const fetchDocs = async () => {
    const res = await axios.get("http://localhost:5000/documents");
    setDocs(res.data);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // Upload File
  const uploadFile = async () => {
    if (!file) {
      setMessage("Please select a PDF file");
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage("Only PDF files allowed");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:5000/documents/upload", formData);
    setMessage("File uploaded successfully!");

    setFile(null);
    fetchDocs();
  };

  // Delete File
  const deleteFile = async (id) => {
    await axios.delete(`http://localhost:5000/documents/${id}`);
    setMessage("File deleted successfully!");
    fetchDocs();
  };

  return (
    <div className="container">
      <h1 className="title">Medical Document Manager</h1>

      {message && <div className="message">{message}</div>}

      <UploadBox file={file} setFile={setFile} uploadFile={uploadFile} />

      <h2 className="subtitle">Uploaded Documents</h2>

      <DocumentList docs={docs} deleteFile={deleteFile} />
    </div>
  );
}

export default App;
