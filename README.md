# StartupC Project

A comprehensive Next.js application for managing startup project applications and onboarding processes. This platform provides a multi-step onboarding flow for entrepreneurs to submit their project applications with team member management and program selection.

## 🚀 Features

### Core Functionality
- **Multi-step Onboarding Process**: 7-step application flow for startup projects
- **User Authentication**: Secure login/signup with NextAuth.js
- **Team Management**: Add and manage team members with detailed information
- **Program Selection**: Choose from different startup programs (Inqubalab, Idea Feedback, Aceleración)
- **Form Validation**: Comprehensive validation using Zod schemas
- **Progress Tracking**: Visual progress indicators and step navigation
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Onboarding Steps
1. **Program Selection** - Choose startup program type
2. **General Data** - Project name, website, category, industry, description
3. **Impact & Origin** - Opportunity value, stage, project origin, problem statement
4. **Presentation** - Video upload and specific support requirements
5. **Team** - Team member management with academic and contact information
6. **Preferences** - Personal preferences (sports, hobbies, movie genres)
7. **Consent** - Privacy policy acceptance

### User Management
- User registration and authentication
- Profile management
- Session handling with JWT
- Role-based access control

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication solution

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Package manager

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── onboarding/    # Onboarding API
│   │   └── project/       # Project management API
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── onboarding/        # Onboarding flow
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
│   ├── auth/             # Authentication utilities
│   ├── db.ts             # Database connection
│   └── utils/            # Helper functions
└── prisma/               # Database schema and migrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd startupc-project
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/startupc_db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Optional: Google OAuth (if enabled)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Run database migrations
   pnpm db:migrate
   
   # Seed database (optional)
   pnpm db:seed
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Key Models

#### User
- Basic user information (name, email, password)
- Role-based access control
- Session management

#### ProjectApplication
- Multi-step onboarding data
- Program selection and project details
- Team member relationships

#### TeamMember
- Detailed team member information
- Academic details (university, career, cycle)
- Contact information and social links

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
pnpm db:format        # Format Prisma schema
pnpm db:validate      # Validate Prisma schema
```

## 🔐 Authentication

The application uses NextAuth.js with the following providers:
- **Credentials Provider** - Email/password authentication
- **Google Provider** - OAuth authentication (commented out by default)

### Authentication Flow
1. User registers with email and password
2. Password is hashed using bcryptjs
3. JWT tokens are used for session management
4. Protected routes check for valid sessions

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Onboarding
- `GET /api/onboarding/[step]` - Get step data
- `POST /api/onboarding/[step]` - Save step data
- `GET /api/onboarding/current-step` - Get current step
- `GET /api/onboarding/status` - Get onboarding status

### Project Management
- `GET /api/project` - Get project data
- `POST /api/project` - Create/update project

## 🎨 UI Components

The project uses Shadcn/ui components with Tailwind CSS:

- **Form Components**: Input, Textarea, Select, RadioGroup, Checkbox
- **Layout Components**: Card, Button, Steps
- **Navigation**: Breadcrumb, Menu
- **Feedback**: Alert, Dialog, Progress

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Zod schemas for all form inputs
- **Session Management**: Secure JWT-based sessions
- **CSRF Protection**: Built-in NextAuth.js protection
- **Rate Limiting**: Login attempt tracking

## 🧪 Validation Rules

### Team Member Validation
- Required fields: firstName, lastName, dni, career, phone, contactEmail, university
- Conditional validation for Laureate universities (studentCode, cycle, universityEmail)
- Conditional validation for "other" universities (otherUniversity)
- LinkedIn URL validation
- Email format validation

### Project Validation
- Minimum character requirements for descriptions
- Required program selection
- Valid category and industry selection
- Video upload support

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_DOMAIN="your-domain.com"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔄 Version History

- **v0.1.0** - Initial release with basic onboarding flow
- Multi-step form implementation
- User authentication system
- Team member management
- Database schema and migrations

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
