# MegaBlog - Modern Blogging Platform

A beautiful, modern blogging platform built with React, Redux, and Firebase backend. Perfect for creators who want to share their stories with the world.

![MegaBlog Preview](https://img.shields.io/badge/MegaBlog-Modern%20Blogging-blue?style=for-the-badge&logo=react)

## ✨ Features

- **Modern Design**: Beautiful, responsive UI with smooth animations
- **User Authentication**: Secure login/signup system
- **Blog Management**: Create, edit, and manage blog posts
- **Rich Text Editor**: TinyMCE integration for content creation
- **Responsive Layout**: Works perfectly on all devices
- **Real-time Updates**: Instant content updates with Redux
- **Professional Styling**: Tailwind CSS with custom design system

## 🚀 Tech Stack

- **Frontend**: React 18, Redux Toolkit, React Router
- **Styling**: Tailwind CSS with custom design tokens
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Build Tool**: Vite
- **Deployment**: Vercel ready

## 🎨 Design System

- **Color Palette**: Modern teal (primary), coral (secondary), and warm orange (accent) colors
- **Typography**: Inter, Poppins, and JetBrains Mono fonts
- **Components**: Consistent spacing, shadows, and animations
- **Responsive**: Mobile-first design approach

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MegaBlog
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Update the Firebase configuration in `src/firebase/config.js`

4. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository

2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the Vite configuration

3. **Firebase Configuration**: Update Firebase config in `src/firebase/config.js` with your project details

4. **Deploy**: Click deploy and your blog will be live!

### Manual Deployment

```bash
# Build the project
npm run build

# The built files will be in the `dist` folder
# Upload these files to your hosting provider
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password provider)
3. Create a Firestore database
4. Set up security rules for Firestore
5. Update Firebase configuration in the code

### Customization

- **Colors**: Modify `tailwind.config.js` color palette
- **Fonts**: Update Google Fonts in `index.html`
- **Components**: Customize component styles in respective files

## 📱 Screenshots

- **Homepage**: Beautiful landing page with featured posts
- **Authentication**: Modern login/signup forms
- **Dashboard**: Clean post management interface
- **Responsive**: Perfect on all device sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Firebase](https://firebase.google.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**Made with ❤️ for the developer community**

*Perfect for portfolios, personal blogs, and content creators!*
