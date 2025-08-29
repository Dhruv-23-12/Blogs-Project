# Setup Guide for 12MegaBlog

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Appwrite Configuration
VITE_APPWRITE_URL=https://your-appwrite-instance.cloud.appwrite.io
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_COLLECTION_ID=your-collection-id
VITE_APPWRITE_BUCKET_ID=your-bucket-id

# TinyMCE API Key (Optional - for production use)
VITE_TINYMCE_API_KEY=your-tinymce-api-key
```

## Appwrite Database Schema

Your Appwrite collection should have the following attributes:

- `title` (string, required)
- `slug` (string, required, unique)
- `content` (string, required)
- `featuredImage` (string, optional)
- `status` (string, optional - "active" or "inactive")
- `userId` (string, required)

## TinyMCE Setup

1. Get a free API key from [TinyMCE](https://www.tiny.cloud/)
2. Replace `"your-tinymce-api-key-here"` in `src/components/RTE.jsx` with your actual API key
3. Or use the environment variable `VITE_TINYMCE_API_KEY`

## Installation

1. Install dependencies: `npm install`
2. Set up environment variables
3. Configure Appwrite database and collection
4. Run the app: `npm run dev`

## Common Issues Fixed

- ✅ Removed invalid "status" query from getPosts
- ✅ Fixed PostForm slug initialization
- ✅ Added TinyMCE API key configuration
- ✅ Improved error handling in auth service
