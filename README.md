# Creative Worship Flow

A full-stack web application for AI-powered worship service planning.

## Features

- 🙏 AI-powered service plan generation using GPT-4
- 👤 User authentication with Firebase
- 💳 Stripe subscription with 7-day free trial
- 📄 PDF export and print capabilities
- 💾 Save, edit, and manage service plans
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **PDF Generation**: jsPDF, html2canvas

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- Firebase project created
- Stripe account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd creative-worship-flow
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
   - Add your Firebase configuration
   - Add your OpenAI API key
   - Add your Stripe keys
   - Set up your app URL

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Add your Firebase config to `.env.local`

### Stripe Setup

1. Create a Stripe account
2. Create a product and price ($15/month)
3. Add the price ID to `.env.local`
4. Set up webhook endpoint for `/api/webhook`
5. Add webhook secret to `.env.local`

### Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

Run tests:
```bash
npm test
```

## Project Structure

```
creative-worship-flow/
├── pages/              # Next.js pages and API routes
├── components/         # React components
├── lib/               # Utility functions and configurations
├── hooks/             # Custom React hooks
├── contexts/          # React contexts
├── styles/            # Global styles
├── __tests__/         # Test files
└── public/            # Static assets
```

## Database Schema

### Users Collection
```javascript
{
  email: string,
  worship_style: string,
  favorite_songs: string,
  service_structure: string,
  worship_philosophy: string (optional),
  congregation_notes: string (optional),
  trial_start: timestamp,
  trial_end: timestamp,
  is_subscribed: boolean,
  stripe_customer_id: string (optional),
  subscription_id: string (optional),
  created_at: timestamp
}
```

### Service Plans Collection
```javascript
{
  userId: string,
  theme: string,
  service_plan: string,
  created_at: timestamp
}
```

## API Endpoints

- `POST /api/generate-plan` - Generate a new service plan
- `POST /api/create-checkout-session` - Create Stripe checkout session
- `POST /api/webhook` - Stripe webhook handler

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to update:
- `NEXT_PUBLIC_APP_URL` to your production URL
- All API keys and secrets
- Stripe webhook endpoint

## Security Considerations

- All API routes validate user authentication
- Firestore security rules should be configured
- Environment variables must be kept secret
- HTTPS is required for production

## Testing

The project includes unit tests for:
- Authentication flow
- Subscription management
- Service plan generation

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue in the repository.
