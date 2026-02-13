# Company Library Management System

A full-stack web application for managing a company's book library with borrowing capabilities.

## 🔗 Live Demo

**Production**: https://company-library-yourname.netlify.app

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Netlify
- **Version Control**: GitHub

## 🚀 Features

- ✅ Add/Edit/Delete books
- ✅ ISBN auto-fetch for book metadata
- ✅ Borrow and return books
- ✅ Person management
- ✅ Search and filter
- ✅ Real-time data synchronization
- ✅ Borrowing history tracking

## 📦 Local Development

\`\`\`bash

# Install dependencies

npm install

# Add .env file with:

VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key

# Run development server

npm run dev

# Build for production

npm run build
\`\`\`

## 📝 Database Schema

- **books**: Book catalog with borrowing status
- **persons**: Library members
- **borrowing_history**: Audit trail of all transactions

## 🔄 Deployment

Automatic deployment via Netlify on push to `main` branch.

## 📧 Contact

Built by [Your Name]
