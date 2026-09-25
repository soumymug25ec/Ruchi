// ============================================
// RUCHI FRONTEND - React Components
// ============================================

// ============================================
// 1. DESIGN TOKENS & THEME
// ============================================

export const RUCHI_THEME = {
  colors: {
    primary: '#6B5FFF',      // Purple
    primaryDark: '#5547D9',   // Darker purple
    primaryLight: '#E6E0FF',  // Light purple
    navy: '#1A1F3A',         // Navy dark
    bgLight: '#F5F3FF',      // Very light purple
    text: '#1A1F3A',         // Navy for text
    textSecondary: '#8B8B8B', // Gray
    white: '#FFFFFF',
    error: '#FF4757',
    success: '#2ED573',
    warning: '#FFA502',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
}

// ============================================
// 2. LANDING PAGE
// ============================================

import React from 'react'
import { ChevronRight } from 'lucide-react'

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ruchi-bg-light via-white to-white overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-ruchi-navy rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="font-bold text-xl text-ruchi-navy">RUCHI</span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-ruchi-navy">
          <a href="#" className="hover:text-ruchi-purple transition">
            About
          </a>
          <a href="#" className="hover:text-ruchi-purple transition">
            Features
          </a>
          <button className="px-6 py-2 bg-white border-2 border-ruchi-navy text-ruchi-navy rounded-full font-semibold hover:bg-ruchi-navy hover:text-white transition">
            Sign In
          </button>
          <button className="px-6 py-2 bg-ruchi-purple text-white rounded-full font-semibold hover:bg-ruchi-primaryDark transition">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-ruchi-navy leading-tight mb-6">
              Find people with
              <span className="text-ruchi-purple"> shared interests</span>
              <br />
              in your institution.
            </h1>
            <p className="text-xl text-ruchi-textSecondary mb-8 leading-relaxed max-w-lg">
              Ruchi helps you discover people and communities based on what you love — in your college, school, hostel or locality.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-ruchi-purple text-white rounded-full font-semibold hover:bg-ruchi-primaryDark transition flex items-center gap-2">
                Get Started
                <ChevronRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white border-2 border-ruchi-navy text-ruchi-navy rounded-full font-semibold hover:bg-ruchi-bgLight transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Interest Tags (Visual) */}
          <div className="relative h-96 hidden md:block">
            <div className="absolute top-0 left-10 bg-ruchi-primaryLight rounded-full p-3 flex items-center gap-2">
              <span className="text-2xl">🎌</span>
              <span className="font-semibold text-ruchi-navy">Anime & Manga</span>
            </div>
            <div className="absolute top-20 right-0 bg-ruchi-primaryLight rounded-full p-3 flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <span className="font-semibold text-ruchi-navy">Gaming</span>
            </div>
            <div className="absolute left-0 top-40 bg-ruchi-primaryLight rounded-full p-3 flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              <span className="font-semibold text-ruchi-navy">Music</span>
            </div>
            <div className="absolute right-10 top-48 bg-ruchi-primaryLight rounded-full p-3 flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="font-semibold text-ruchi-navy">Books</span>
            </div>
            <div className="absolute bottom-10 left-1/4 bg-ruchi-primaryLight rounded-full p-3 flex items-center gap-2">
              <span className="text-2xl">✈️</span>
              <span className="font-semibold text-ruchi-navy">Travel</span>
            </div>
            <div className="absolute bottom-20 right-5 bg-ruchi-primaryLight rounded-full p-3 flex items-center gap-2">
              <span className="text-2xl">💪</span>
              <span className="font-semibold text-ruchi-navy">Fitness</span>
            </div>

            {/* Center Ruchi Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-ruchi-purple flex items-center justify-center bg-white">
                <span className="text-4xl font-bold text-ruchi-purple">R</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-ruchi-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-16 text-center">Why Ruchi?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Smart Matching',
                desc: 'Our algorithm finds your perfect match based on shared interests.',
              },
              {
                icon: '🔐',
                title: 'Anonymous & Safe',
                desc: 'Chat with a pseudonym. Your real identity stays private.',
              },
              {
                icon: '🌍',
                title: 'Build Communities',
                desc: 'Join groups, share thoughts, and grow your network.',
              },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 3. AUTHENTICATION PAGES
// ============================================

export const SignInPage: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-ruchi-primaryLight to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ruchi-navy rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h1 className="text-3xl font-bold text-ruchi-navy">RUCHI</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-ruchi-navy mb-2">Sign In</h2>
          <p className="text-ruchi-textSecondary mb-6">Welcome back to your community</p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-ruchi-navy mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.ac.in"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ruchi-purple focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ruchi-navy mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ruchi-purple focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-ruchi-purple text-white font-bold rounded-lg hover:bg-ruchi-primaryDark transition"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ruchi-textSecondary">
              Don't have an account?{' '}
              <a href="/auth/signup" className="text-ruchi-purple font-semibold hover:text-ruchi-primaryDark">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SignUpPage: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-ruchi-primaryLight to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ruchi-navy rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h1 className="text-3xl font-bold text-ruchi-navy">RUCHI</h1>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-ruchi-navy mb-2">Create Account</h2>
          <p className="text-ruchi-textSecondary mb-6">Join your college community</p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-ruchi-navy mb-2">
                Institution Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@kiit.ac.in"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ruchi-purple focus:outline-none transition"
              />
              <p className="text-xs text-ruchi-textSecondary mt-2">
                Must use your college email address
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ruchi-navy mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ruchi-purple focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ruchi-navy mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ruchi-purple focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-ruchi-purple text-white font-bold rounded-lg hover:bg-ruchi-primaryDark transition"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ruchi-textSecondary">
              Already have an account?{' '}
              <a href="/auth/signin" className="text-ruchi-purple font-semibold">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 4. INTEREST PROFILING COMPONENTS
// ============================================

const INTEREST_CATEGORIES = [
  { id: 1, name: 'Anime & Manga', emoji: '🎌' },
  { id: 2, name: 'Gaming', emoji: '🎮' },
  { id: 3, name: 'Modeling & Fashion', emoji: '👗' },
  { id: 4, name: 'Health & Fitness', emoji: '💪' },
  { id: 5, name: 'Food & Travel', emoji: '🌍' },
  { id: 6, name: 'History & Politics', emoji: '📚' },
  { id: 7, name: 'Debate & Reading', emoji: '📖' },
  { id: 8, name: 'Music & Pop', emoji: '🎵' },
  { id: 9, name: 'Movies & Shows', emoji: '🎬' },
  { id: 10, name: 'Tech & Entrepreneurship', emoji: '💻' },
  { id: 11, name: 'Research & Psychology', emoji: '🔬' },
]

interface InterestGridProps {
  selectedInterests: number[]
  onSelectInterest: (categoryId: number) => void
}

export const InterestGrid: React.FC<InterestGridProps> = ({
  selectedInterests,
  onSelectInterest,
}) => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-ruchi-navy mb-4">
        What are you into?
      </h2>
      <p className="text-ruchi-textSecondary mb-8">
        Select the categories you're interested in
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {INTEREST_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectInterest(category.id)}
            className={`p-4 rounded-xl transition flex flex-col items-center gap-2 ${
              selectedInterests.includes(category.id)
                ? 'bg-ruchi-purple text-white shadow-lg'
                : 'bg-ruchi-bgLight text-ruchi-navy hover:bg-ruchi-primaryLight'
            }`}
          >
            <span className="text-3xl">{category.emoji}</span>
            <span className="font-semibold text-sm">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 5. MATCH CARD COMPONENT
// ============================================

interface MatchCardProps {
  pseudonym: string
  matchScore: number
  sharedInterests: string[]
  onClick: () => void
  onMessage: () => void
}

export const MatchCard: React.FC<MatchCardProps> = ({
  pseudonym,
  matchScore,
  sharedInterests,
  onClick,
  onMessage,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-ruchi-navy">{pseudonym}</h3>
          <p className="text-sm text-ruchi-textSecondary">
            {sharedInterests.length} shared interests
          </p>
        </div>
        <div className="flex items-center justify-center w-14 h-14 bg-ruchi-primaryLight rounded-full">
          <span className="text-2xl font-bold text-ruchi-purple">{matchScore}%</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {sharedInterests.slice(0, 3).map((interest, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-ruchi-bgLight text-ruchi-navy text-xs font-semibold rounded-full"
            >
              {interest}
            </span>
          ))}
          {sharedInterests.length > 3 && (
            <span className="px-3 py-1 bg-ruchi-bgLight text-ruchi-navy text-xs font-semibold rounded-full">
              +{sharedInterests.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClick}
          className="flex-1 py-2 border-2 border-ruchi-purple text-ruchi-purple font-semibold rounded-lg hover:bg-ruchi-primaryLight transition"
        >
          View Profile
        </button>
        <button
          onClick={onMessage}
          className="flex-1 py-2 bg-ruchi-purple text-white font-semibold rounded-lg hover:bg-ruchi-primaryDark transition"
        >
          Chat
        </button>
      </div>
    </div>
  )
}

// ============================================
// 6. CHAT COMPONENTS
// ============================================

interface MessageBubbleProps {
  content: string
  isSent: boolean
  timestamp: string
  isVoiceNote?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isSent,
  timestamp,
  isVoiceNote,
}) => {
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-xs rounded-2xl px-4 py-2 ${
          isSent
            ? 'bg-ruchi-purple text-white'
            : 'bg-ruchi-bgLight text-ruchi-navy'
        }`}
      >
        {isVoiceNote ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎙️</span>
            <span className="text-sm font-semibold">Voice message</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{content}</p>
        )}
        <p className={`text-xs mt-1 ${isSent ? 'text-purple-100' : 'text-gray-500'}`}>
          {timestamp}
        </p>
      </div>
    </div>
  )
}

interface ChatWindowProps {
  pseudonym: string
  matchScore: number
  messages: Array<{
    id: string
    content: string
    isSent: boolean
    timestamp: string
  }>
  onSendMessage: (message: string) => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  pseudonym,
  matchScore,
  messages,
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = React.useState('')

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-bold text-ruchi-navy">{pseudonym}</h2>
        <p className="text-sm text-ruchi-textSecondary">{matchScore}% match</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.content}
            isSent={msg.isSent}
            timestamp={msg.timestamp}
          />
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-ruchi-purple"
        />
        <button
          onClick={handleSend}
          className="px-6 py-2 bg-ruchi-purple text-white font-semibold rounded-lg hover:bg-ruchi-primaryDark transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}

// ============================================
// 7. COMMON COMPONENTS
// ============================================

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
}) => {
  const baseClasses =
    'font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-ruchi-purple text-white hover:bg-ruchi-primaryDark',
    secondary: 'bg-ruchi-bgLight text-ruchi-navy hover:bg-ruchi-primaryLight',
    outline: 'border-2 border-ruchi-purple text-ruchi-purple hover:bg-ruchi-primaryLight',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

interface AvatarProps {
  pseudonym: string
  size?: 'sm' | 'md' | 'lg'
}

export const Avatar: React.FC<AvatarProps> = ({ pseudonym, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  }

  const initials = pseudonym
    .split('_')
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-ruchi-purple text-white flex items-center justify-center font-bold`}
    >
      {initials}
    </div>
  )
}

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-ruchi-primaryLight border-t-ruchi-purple rounded-full animate-spin" />
    </div>
  )
}

// ============================================
// 8. EXPORT ALL
// ============================================

export const RuchiComponents = {
  LandingPage,
  SignInPage,
  SignUpPage,
  InterestGrid,
  MatchCard,
  ChatWindow,
  MessageBubble,
  Button,
  Avatar,
  LoadingSpinner,
}
