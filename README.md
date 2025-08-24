# Hive Dashboard

A modern, responsive dashboard application built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard**: Overview of key metrics and insights
- **Content Management**: Create and manage educational content
- **Analytics**: Track performance and user engagement
- **Bug Tracker**: Monitor and resolve issues
- **Feature Roadmap**: Plan and track new features
- **Calendar**: Schedule and manage events
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark UI with amber accents

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives with custom styling
- **Routing**: React Router DOM
- **Drag & Drop**: @hello-pangea/dnd for feature management
- **Rich Text Editor**: React Quill for content creation
- **Charts**: Recharts for data visualization

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── content/        # Content-specific components
│   └── ui/            # Base UI components
├── pages/              # Main application pages
├── api/                # Mock data and API functions
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── utils/              # Helper functions
```

## Customization

The application includes mock data that can be easily replaced with real API endpoints. Update the functions in `src/api/entities.js` to connect to your backend services.

## Deployment

This application is ready to deploy to Vercel, Netlify, or any other static hosting platform. The build process creates optimized production files that can be served from any web server.