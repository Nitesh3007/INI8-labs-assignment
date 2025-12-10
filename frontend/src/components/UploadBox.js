
const UploadBox = ({ file, setFile, uploadFile }) => {
  return (
    <div className="upload-box">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="file-input"
      />
      <button onClick={uploadFile} className="btn upload-btn">
        Upload
      </button>
    </div>
  );
};

export default UploadBox;