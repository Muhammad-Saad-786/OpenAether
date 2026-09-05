# 🧠 OpenAether - Democratizing AI Access

<div align="center">

![OpenAether Logo](https://img.shields.io/badge/OpenAether-Free%20AI%20Platform-6c5ce7?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/openaether/openaether/pulls)
[![Contributors](https://img.shields.io/github/contributors/openaether/openaether)](https://github.com/openaether/openaether/graphs/contributors)
[![Stars](https://img.shields.io/github/stars/openaether/openaether?style=social)](https://github.com/openaether/openaether/stargazers)

**Access Multiple Free AI Models Through One Beautiful Interface**

*Free Forever • Open Source • Privacy First*

[Live Demo](https://openaether.vercel.app) • [Documentation](https://github.com/openaether/openaether/wiki) • [Report Bug](https://github.com/openaether/openaether/issues) • [Request Feature](https://github.com/openaether/openaether/issues)

</div>

---

## 🌟 What is OpenAether?

OpenAether is an **open-source platform** that aggregates free AI models from multiple providers into a single, unified interface. Instead of managing multiple API keys and learning different APIs, users can access GPT-4o Mini, Gemma, GLM, MiniMax, and more through one clean, intuitive platform.

### Why OpenAether?

- 💰 **100% Free** - Uses free tiers from OpenRouter, Groq, and Gemini
- 🔄 **Smart Routing** - Automatically selects the best model for your task
- 🛡️ **Automatic Failover** - If one provider fails, another takes over seamlessly
- 🔒 **Privacy First** - Your data never leaves your control
- 🎨 **Beautiful UI** - Dark/Light themes, markdown support, code highlighting
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🚀 **Open Source** - Community-driven and transparent

---

## ✨ Features

### 🤖 Multi-Provider Support

| Provider | Free Models | Status |
|----------|-------------|--------|
| OpenRouter | GPT-4o Mini, Gemma 4, GLM 5.2, MiniMax M3 | ✅ Active |
| Groq | GPT-OSS 20B, GPT-OSS 120B | ⏳ Coming Soon |
| Gemini | Gemini 1.5 Flash, Gemini Pro | ⏳ Coming Soon |

### 💬 Advanced Chat Features

- **Markdown Rendering** - Headers, lists, tables, code blocks
- **Syntax Highlighting** - 30+ programming languages
- **Copy Buttons** - Copy messages or individual code blocks
- **Edit Messages** - Edit user messages and regenerate responses
- **Regenerate** - Get new AI responses
- **Delete Messages** - Remove unwanted messages
- **Auto-Titled Conversations** - Conversations named from first message
- **Typing Indicator** - Animated dots while AI thinks

### 🎯 Smart Routing

- **Task-Based Routing** - Coding, chat, analysis
- **Model Rotation** - Avoids rate limits
- **Automatic Failover** - Switches providers on failure
- **Rate Limit Management** - Respects free tier limits
- **Response Caching** - Reduces redundant API calls

### 👤 User Features

- **Authentication** - Email/Password + Google (coming soon)
- **Profile Management** - Update username, profile picture
- **API Key Management** - Secure storage, test keys
- **Conversation History** - Save and organize chats
- **Dashboard** - Usage statistics, activity tracking

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS v4 |
| **UI Components** | shadcn/ui, Radix UI |
| **State Management** | Zustand |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **API Providers** | OpenRouter, Groq, Gemini |
| **Markdown** | react-markdown, remark-gfm |
| **Syntax Highlighting** | react-syntax-highlighter |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |

</div>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free)
- OpenRouter API key (free)

### Installation

```bash
# Clone the repository
git clone https://github.com/openaether/openaether.git

# Navigate to project
cd openaether

# Install dependencies
npm install

# Create environment variables
cp .env.example .env.local