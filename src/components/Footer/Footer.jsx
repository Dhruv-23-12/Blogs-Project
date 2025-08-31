import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Logo from '../Logo'

function Footer() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path)
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigation('/')}
                className="hover:opacity-80 transition-opacity duration-300"
              >
                <Logo width="100px" className="filter brightness-0 invert" />
              </button>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-sm">
              Share your stories, connect with readers, and build your community through meaningful content.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-400 transition-colors duration-300"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/')}
                  className="text-neutral-300 hover:text-primary-400 transition-colors duration-300 text-sm text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/all-posts')}
                  className="text-neutral-300 hover:text-primary-400 transition-colors duration-300 text-sm text-left"
                >
                  All Posts
                </button>
              </li>
              {authStatus && (
                <>
                  <li>
                    <button 
                      onClick={() => handleNavigation('/dashboard')}
                      className="text-neutral-300 hover:text-primary-400 transition-colors duration-300 text-sm text-left"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('/add-post')}
                      className="text-neutral-300 hover:text-primary-400 transition-colors duration-300 text-sm text-left"
                    >
                      Create Post
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Account
            </h3>
            <ul className="space-y-3">
              {authStatus ? (
                <>
                  <li>
                    <button 
                      onClick={() => handleNavigation('/dashboard')}
                      className="text-neutral-300 hover:text-primary-400 transition-colors duration-300 text-sm text-left"
                    >
                      My Dashboard
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('/all-posts')}
                      className="text-neutral-300 hover:text-primary-400 transition-colors duration-300 text-sm text-left"
                    >
                      My Posts
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button 
                      onClick={() => handleNavigation('/login')}
                      className="text-neutral-300 hover:text-primary-400 transition-colors duration-300 text-sm text-left"
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('/signup')}
                      className="text-neutral-300 hover:text-primary-400 transition-colors duration-300 text-sm text-left"
                    >
                      Sign Up
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:support@megablog.com" 
                  className="text-neutral-300 hover:text-primary-400 transition-colors duration-300 text-sm"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <span className="text-neutral-300 text-sm">
                  Version 1.0.0
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-neutral-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-neutral-400 text-sm">
              &copy; 2025 MegaBlog. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-neutral-400">
              <span>Built with React & Appwrite</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer