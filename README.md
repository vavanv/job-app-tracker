# Job Application Tracker

A modern, offline-first web application built with Angular for tracking job applications. Store and manage your job search progress locally with no backend required.

## Features

### 📊 Dashboard
- Quick statistics overview (total applications, interviews, offers, rejections)
- Recent applications summary
- Quick action buttons for adding new applications

### 💼 Job Application Management
- **Create, Read, Update, Delete** job applications
- Track essential information:
  - Company name and website
  - Job title and position
  - Application date and status
  - Notes and job posting links
  - Resume and cover letter attachments (PDF, DOC, DOCX)
- **Status tracking** with color-coded indicators:
  - Applied, Interview, Offer, Rejected, Withdrawn
- **File attachments**: Upload, download, and manage resumes and cover letters
- **Company website links**: Direct access to company websites

### 🔍 Search & Filter
- Search by company name or job title
- Filter by application status
- Filter by application date range
- Real-time search results

### 📈 Analytics
- Application statistics and trends
- Status distribution charts
- Timeline analysis

### ⚙️ Settings
- Customizable application preferences
- Data management options
- Export/import functionality

### 🎨 Modern UI/UX
- **Custom input components** with clean underline styling
- **Responsive design** for mobile, tablet, and desktop
- **Angular Material** integration for consistent UI
- **Offline-first** with IndexedDB storage
- **Dark/light theme** support

## Technology Stack

- **Frontend**: Angular 19 + TypeScript
- **UI Library**: Angular Material + Custom Components
- **Storage**: IndexedDB (offline-first, no backend required)
- **Styling**: Angular Material + Custom CSS
- **State Management**: RxJS
- **File Handling**: Blob storage for attachments

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd job-app-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Navigate to `http://localhost:4200/`

## Development

### Development server
Run `ng serve` or `npm start` for a dev server. The application will automatically reload if you change any of the source files.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Dashboard with statistics
│   │   ├── job-form/           # Create/Edit job applications
│   │   ├── job-list/           # List all applications
│   │   ├── job-detail/         # View application details
│   │   ├── analytics/          # Analytics and charts
│   │   ├── settings/           # App settings
│   │   └── simple-input/       # Custom input component
│   ├── services/
│   │   ├── indexeddb.service.ts    # IndexedDB operations
│   │   ├── job.service.ts          # Job application logic
│   │   └── settings.service.ts     # Settings management
│   └── models/
│       └── job-application.ts      # Data models
```

## Data Storage

The application uses **IndexedDB** for local storage, ensuring:
- ✅ Offline functionality
- ✅ No backend required
- ✅ Data persistence across browser sessions
- ✅ File attachment storage
- ✅ Fast search and filtering

## Deployment

This is a static Angular application that can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

Simply build the project and deploy the `dist/` folder.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
