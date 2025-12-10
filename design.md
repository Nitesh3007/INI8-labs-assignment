# **Design Document – Patient Document Portal**

This document describes the architecture, technology stack, API design, and assumptions behind the Patient Document Portal application. This system allows users to upload, view, download, and delete PDF medical documents.

---

# **1. Tech Stack Choices**

### **Q1. What frontend framework did you use and why?**

**React.js**

* Component-based structure makes development modular.
* Strong ecosystem and community support.
* Easy handling of state, forms, and API integration with Axios.
* Efficient Single Page Application behavior.

---

### **Q2. What backend framework did you choose and why?**

**Node.js with Express.js**

* Lightweight and efficient for handling file uploads.
* Simple routing and middleware patterns.
* `express-fileupload` allows easy handling of PDF uploads.
* Works well with SQLite and is ideal for local development.

---

### **Q3. What database did you choose and why?**

**SQLite**

* Serverless and file-based, no installation or separate service required.
* Suitable for small applications and local development.
* Reliable support for SQL operations.
* Lightweight but functional enough for metadata storage.

If scaling the system, PostgreSQL or MySQL would be recommended.

---

### **Q4. If you were to support 1,000 users, what changes would you consider?**

**Backend Changes**

* Move from SQLite to PostgreSQL or MySQL.
* Store files in scalable storage like AWS S3 instead of local uploads.
* Add user authentication (JWT).
* Introduce pagination for listing documents.
* Add caching and load balancing.

**Frontend Changes**

* Implement proper authentication and session handling.
* Add upload progress indicators.
* Improve UI performance for large lists.

**Infrastructure Changes**

* Deploy services on cloud platforms (AWS, GCP, DigitalOcean).
* Use CDN for faster file delivery.
* Enable logging, monitoring, and automated backups.

---

# **2. Architecture Overview**

## **System Components**

1. **Frontend (React)**
   Handles the UI, file uploads, and API interaction using Axios.

2. **Backend (Express.js)**
   Receives files, validates them, saves them in the uploads folder, stores metadata, and handles file download/delete.

3. **Database (SQLite)**
   Stores metadata such as:

   * id
   * filename
   * filepath
   * filesize
   * created_at

4. **File Storage (Local)**
   PDFs are stored inside the `/uploads` directory in the backend.

---

## **Architecture Diagram**

```
┌──────────────────┐       ┌─────────────────────┐      ┌────────────────────┐
│   Frontend        │       │      Backend         │      │      Database       │
│  (React App)      │ <---> │   (Express API)      │ <--> │      SQLite         │
└──────────────────┘       └─────────────────────┘      └────────────────────┘
            │                          │
            │        File Upload        │
            ▼                          ▼
                                  ┌────────────────────┐
                                  │   /uploads folder   │
                                  └────────────────────┘
```

---

# **3. API Specification**

---

## **POST /documents/upload**

**Description:** Upload a PDF document.
**Request Type:** `multipart/form-data`

### Sample Request

* `file`: PDF file selected by user.

### Sample Response

```json
{
  "message": "File uploaded",
  "id": 3
}
```

---

## **GET /documents**

**Description:** Retrieve the list of uploaded documents.

### Sample Response

```json
[
  {
    "id": 1,
    "filename": "report.pdf",
    "filepath": "uploads/report.pdf",
    "filesize": 30482,
    "created_at": "2025-02-12 10:30:00"
  }
]
```

---

## **GET /documents/:id**

**Description:** Download a specific PDF by ID.

Response triggers a file download.

---

## **DELETE /documents/:id**

**Description:** Delete a specific file and remove its metadata.

### Sample Response

```json
{
  "message": "Deleted successfully"
}
```

---

# **4. Data Flow Description**

### **Q5. Describe the step-by-step process for upload and download.**

---

## **File Upload Flow**

1. User selects a PDF file from the frontend.
2. A POST request is sent to `/documents/upload` using `multipart/form-data`.
3. Backend validates the file (checks if exists and is a PDF).
4. Backend saves the file into the `/uploads` directory.
5. Metadata is inserted into the SQLite database:

   * filename
   * filepath
   * filesize
   * created_at
6. Backend returns success response.
7. Frontend refreshes the document list.

---

## **File Download Flow**

1. User clicks the "Download" button.
2. Frontend sends a GET request to `/documents/:id`.
3. Backend checks the database for the file record.
4. Backend uses `res.download()` to send the file.
5. Browser downloads the file.

---

# **5. Assumptions**

### **Q6. What assumptions were made?**

* Only a single user exists (no authentication).
* Only PDF files are allowed for upload.
* File size limit is based on default express-fileupload configuration (up to approximately 50MB).
* File names are assumed to not conflict, but in production UUID-based naming should be used.
* The application is intended for local usage only.
* No encryption or versioning of documents is implemented.
* Concurrent uploads are minimal and not expected to cause issues.
* SQLite is sufficient for the scope of this assignment.

---
