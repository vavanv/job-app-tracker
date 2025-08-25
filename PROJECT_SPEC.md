# Job Application Tracker – Project Specification

## 1. Overview

The Job Application Tracker is a web application that allows users to log, manage, and monitor job applications.

- **Frontend**: Angular latest version, custom simple input components with underline styling, and RxJS for a modern, responsive design
- **Storage**: IndexedDB (local, persistent storage in browser)
- **Hosting**: Any static web host (Netlify, Vercel, GitHub Pages, etc.)

The app helps users keep track of job applications, companies, positions, statuses, deadlines, and interview progress.

## 2. Goals & Non-Goals

### Goals:

- Track job applications offline (IndexedDB)
- Provide modern, mobile-friendly UI 
- Offer CRUD (Create, Read, Update, Delete) functionality
- Allow searching and filtering of applications
- Dashboard view with quick statistics
- Support attachment of Resume and Cover Letter files per application
- Capture and surface company website links

### Non-Goals:

- No server backend (all local storage only)
- No user authentication
- No collaboration/multi-user features

## 3. Core Features

### 3.1 Job Applications

**Add a job application with fields:**

- Company Name
- Company Website (URL)
- Job Title / Position
- Application Date
- Application Status (Applied, Interview, Offer, Rejected, etc.)
- Notes (free text)
- Link to Job Posting
- Resume (PDF or DOC/DOCX file)
- Cover Letter (PDF or DOC/DOCX file)

**Functionality:**

- Edit job applications
- Delete job applications
- View all applications in a table/list view
- Upload, replace, download/remove Resume and Cover Letter attachments
- Edit Form UX: when editing an application that already has a Resume (or Cover Letter), if no new file is selected, show a button (e.g., "RESUME") to download the persisted file directly. Selecting a new file replaces the existing attachment on save.

### 3.2 Company Website Behavior

- Accept a valid URL (with or without protocol). If protocol missing, assume `https://` for display and linking.
- Display on application cards as a small secondary action that opens in a new tab.
- Basic validation: must be a well-formed URL after protocol normalization.

### 3.3 Application Status Tracking

- Color-coded statuses
- Update status via dropdown

### 3.4 Search & Filter

- Search by company or job title
- Filter by application status
- Filter by date applied

### 3.5 Dashboard

- Display stats (e.g., total applications, interviews scheduled, offers received, rejections)
- Optional: chart (using Angular Material charts or ng2-charts)

### 3.6 Responsive UI

- Mobile, tablet, and desktop support
- Angular Material Toolbar, Sidenav, Table, Dialog for UX

## 4. Technical Requirements

- **Frontend Framework**: Angular + Typescript
- **UI Library**: Angular Material (navigation, layout) + Custom Simple Input Components
- **Form Styling**: Custom underline-only input styling for consistent, clean design
- **Local Storage**: IndexedDB (via idb wrapper library for convenience)
- **Routing**: Router 
- **Deployment**: Static hosting

### 4.1 Attachments Storage

- Store Resume and Cover Letter as binary `Blob` data in IndexedDB
- Accept MIME types: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Save metadata for each attachment: `fileName`, `mimeType`, `size`, `updatedAt`
- Provide download via `URL.createObjectURL(blob)`; revoke URL after use
- Guardrails: validate file size (e.g., up to 10 MB per file), type check, and graceful errors
- Edit Form Behavior: if an attachment exists and no new file is selected, surface a download button for that persisted attachment.

## 5. Project Structure



## 6. Data Models

### Application

```typescript
interface AttachmentMeta {
  fileName: string;
  mimeType: string;
  size: number;
  updatedAt: Date;
}

interface Application {
  id: string;
  companyName: string;
  companyWebsite?: string; // normalized URL for external link
  jobTitle: string;
  applicationDate: Date;
  status: ApplicationStatus;
  notes?: string;
  jobLink?: string;
  resumeBlob?: Blob; // binary content
  resumeMeta?: AttachmentMeta;
  coverLetterBlob?: Blob; // binary content
  coverLetterMeta?: AttachmentMeta;
  createdAt: Date;
  updatedAt: Date;
}

enum ApplicationStatus {
  APPLIED = "Applied",
  INTERVIEW = "Interview",
  OFFER = "Offer",
  REJECTED = "Rejected",
  WITHDRAWN = "Withdrawn",
}
```

## 7. Implementation Phases

### Phase 1: Core Setup

- [x] Angular +  TypeScript setup
- [x] Material UI
- [x] Basic layout structure
- [x] IndexedDB setup and configuration

### Phase 2: Basic CRUD

- [x] Application form (Create/Edit)
- [x] Application list view
- [x] Basic CRUD operations with IndexedDB

### Phase 3: Enhanced Features

- [x] Search and filtering
- [x] Status management
- [x] Dashboard with statistics

### Phase 4: Attachments

- [x] Add Resume and Cover Letter fields to data model
- [x] IndexedDB upgrade to store attachments (DB version bump)
- [x] File upload UI (validate type/size)
- [x] Save attachments (Blob + metadata)
- [x] View/download/remove attachments
- [x] Edit form shows download buttons for persisted attachments when no new file selected

### Phase 5: Custom Input Components

- [x] Create SimpleInputComponent with underline-only styling
- [x] Support for text, textarea, select, and date input types
- [x] Replace Material Design form fields in job application forms
- [x] Implement consistent focus states and error handling
- [x] Maintain form validation and reactive forms integration

### Phase 6: Company Website

- [ ] Add Company Website to data model and UI
- [ ] Validate/normalize URL on input
- [ ] Display website link on cards

### Phase 7: Polish & Deploy

- [ ] Responsive design improvements
- [ ] Error handling
- [ ] Performance optimization
- [ ] Deployment preparation

## 8. Dependencies to Install

```bash
# Core Angular Material packages
npm install @angular/material @angular/cdk @angular/animations
npm install @angular/material-icons

# Additional packages needed
npm install idb
```

## 9. Notes & Considerations

- **IndexedDB**: Use the `idb` library for easier IndexedDB operations
- **Responsive Design**: Ensure mobile-first approach with Angular Material breakpoints
- **Performance**: Implement virtual scrolling for large lists
- **Accessibility**: Follow Angular Material accessibility guidelines
- **Testing**: Consider adding Jasmine/Karma or Jest with Angular Testing Library for testing

---

_Last Updated: January 2025_
_Version: 1.4 (Custom Simple Input Components implemented)_
