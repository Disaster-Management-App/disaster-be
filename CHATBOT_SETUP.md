# Chatbot Setup Guide

## ✅ What's Been Created

### 1. **API Endpoint**
- `/api/chat/route.ts` - Handles chat requests with Gemini AI
- Specialized for disaster management assistance
- Includes system prompt for emergency response guidance

### 2. **UI Components**
- `ChatBot` component - Full chat interface
- `ChatWidget` component - Floating chat button with modal
- Integrated into sidebar navigation

### 3. **Routes**
- `/chat` - Dedicated chat page
- Global chat widget available on all pages

### 4. **Environment Configuration**
- Updated `.env.local` and `.env.example` with `GEMINI_API_KEY`

## 🚀 How to Complete Setup

### 1. **Get Gemini API Key**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. **Update Environment Variables**
Edit your `.env.local` file:
```bash
# Replace with your actual API key
GEMINI_API_KEY=your-actual-gemini-api-key-here

# Also update your database connection if needed
DATABASE_URL=your-database-connection-string
JWT_SECRET=your-jwt-secret
```

### 3. **Test the Chatbot**
1. Your server is running at: `http://localhost:3001`
2. Visit `/chat` for the full chat page
3. Or use the floating chat button (bottom-right corner) on any page

## 🎯 Features

### **Specialized AI Assistant**
- Disaster management expertise
- Emergency response guidance
- Risk assessment advice
- Evacuation procedures
- Resource management help

### **Two Ways to Access**
1. **Dedicated Page**: `/chat` - Full chat interface
2. **Global Widget**: Floating button available everywhere

### **Smart Features**
- Real-time conversation
- Message history
- Typing indicators
- Error handling
- Mobile-responsive design

## 🛠️ Customization

### **Modify AI Behavior**
Edit the `SYSTEM_PROMPT` in `/api/chat/route.ts` to change how the AI responds.

### **Styling**
- Components use Tailwind CSS
- Fully customizable appearance
- Responsive design included

### **Integration**
- Already integrated with your sidebar
- Can be embedded in any page
- Follows your existing design system

## 🔧 Troubleshooting

1. **"API key not set" error**: Update `GEMINI_API_KEY` in `.env.local`
2. **Database errors**: Update `DATABASE_URL` in `.env.local`
3. **Module not found**: Restart the development server after adding the API key

Your chatbot is ready to use once you add the Gemini API key! 🚀
