# Enhanced Quizlet Clone with AI-Powered Study Tools

A feature-rich Quizlet Clone application that uses Google's Generative AI to automatically create interactive study materials from PDF documents. This application offers multiple learning modes including quizzes, flashcards with 3D animations, and matching games, all with dark/light theme support and full-screen functionality.

## Features

### PDF Processing
- Upload PDF documents (up to 5MB)
- AI-powered content extraction and analysis
- Automatic generation of personalized study materials

### Multiple Learning Modes
- **Quiz Mode**: Interactive multiple-choice questions with automatic scoring
- **Flashcards Mode**: Interactive cards with 3D flip animations
- **Matching Mode**: Drag-and-drop matching game for terms and definitions

### Enhanced User Experience
- Dark/light mode support across all pages
- Full-screen study mode for better focus
- Progress tracking in each learning mode
- Smooth animations and transitions
- Responsive design for all devices

## Demo

[View Live Demo](https://pdf-to-quiz-flashcards-and-matching-mode-generator-q84dvdybh.vercel.app/)

## Technologies Used

- **Next.js 15.1.0**: React framework for server-rendered applications
- **TypeScript**: For type-safe code development
- **Tailwind CSS**: For styling components with utility classes
- **Google Generative AI**: Gemini 1.5 Pro for content analysis
- **Framer Motion**: For animations and transitions
- **Shadcn UI**: Component library for consistent design

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Google Generative AI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/M-Muddasir/PDF-to-quiz-flashcards-and-matching-mode-generator-by-using-google-gemini-API
cd PDF-to-quiz-flashcards-and-matching-mode-generator-by-using-google-gemini-API
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Google Generative AI API key:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Upload a PDF**: Drag and drop or select a PDF file (max 5MB)
2. **Choose a Learning Mode**: Select from Quiz, Flashcards, or Matching
3. **Study with AI-Generated Content**: Interact with the automatically generated study materials
4. **Toggle Theme**: Switch between light and dark mode using the theme switcher
5. **Use Full-Screen**: Enter full-screen mode for distraction-free studying

## Deployment

Deploy your own version of this application with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fquizlet-clone&env=GOOGLE_GENERATIVE_AI_API_KEY&envDescription=API%20key%20needed%20for%20Google%20Generative%20AI&envLink=https%3A%2F%2Fai.google.dev%2F)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/docs) for AI integration
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Google Generative AI](https://ai.google.dev/) for content generation

