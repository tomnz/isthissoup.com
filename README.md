# Is This Soup? 🍲

The ultimate question for the modern culinary philosopher. Ask our AI-powered soup oracle whether any food qualifies as soup and get thoughtful, engaging explanations.

Visit the live site: **[isthissoup.com](https://isthissoup.com)**

## ✨ Features

- **Interactive Question Interface**: Beautiful animated placeholder text that cycles through intriguing food options like ramen, shakshuka, beef stew, and ketchup
- **AI-Powered Analysis**: Uses OpenAI's GPT-4o to provide thoughtful, knowledgeable answers about what constitutes soup
- **Real-time Streaming**: Get responses as they're generated using the Vercel AI SDK
- **Modern UI**: Clean, responsive design built with React, Next.js, and Tailwind CSS
- **Mobile-Friendly**: Optimized experience across all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn (recommended) or npm
- OpenAI API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/isthissoup.com.git
   cd isthissoup.com
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and add your OpenAI API key:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. **Run the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Frontend**: React 19 with TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/) with OpenAI
- **Deployment**: Optimized for [Vercel](https://vercel.com/)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/ask-soup/
│   │   └── route.ts          # API endpoint for AI completions
│   ├── globals.css           # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main application page
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes |
| `OPENAI_BASE_URL` | Custom OpenAI base URL (optional) | ❌ No |

### Customizing the AI Prompt

The AI system prompt can be customized in `src/app/api/ask-soup/route.ts`:

```typescript
system: `You are the ultimate soup authority. Your job is to determine whether something is soup or not, and explain your reasoning.

Be thoughtful, knowledgeable, and sometimes playfully philosophical about what constitutes soup...`
```

### Adding New Placeholder Examples

Update the `placeholders` array in `src/app/page.tsx`:

```typescript
const placeholders = [
  'ramen',
  'shakshuka',
  'beef stew',
  // Add your own creative examples here
];
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy with Vercel**
   - Visit [vercel.com](https://vercel.com/)
   - Import your GitHub repository
   - Add your `OPENAI_API_KEY` environment variable in the Vercel dashboard
   - Deploy automatically!

### Other Platforms

This Next.js application can be deployed to any platform that supports Node.js:

- **Netlify**: Add build command `yarn build` and publish directory `out`
- **Railway**: Connect GitHub repo and set environment variables
- **Digital Ocean**: Use App Platform with Node.js buildpack

## 🎨 Customization

### Styling

The app uses Tailwind CSS v4. Key design tokens:

- **Colors**: Orange/red gradient theme (`from-orange-500 to-red-500`)
- **Fonts**: Geist Sans and Geist Mono
- **Animations**: Custom typing animations, hover effects, and loading states

### AI Model

To use a different model, update the API route:

```typescript
const result = await streamText({
  model: openai('gpt-4o'), // Change to gpt-3.5-turbo, etc.
  // ...
});
```

## 🔒 Security Notes

- API keys are server-side only and not exposed to the client
- Rate limiting should be implemented for production use
- Input validation prevents malicious prompts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/isthissoup.com/issues) page
2. Create a new issue with detailed information
3. For urgent matters, contact [your-email@domain.com]

---

*Ask the question that keeps culinary philosophers awake at night: Is it soup?*
