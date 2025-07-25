# StartupC Project

![StartupC Project Cover](./docs/images/image.png)

A comprehensive Next.js application for managing startup project applications and onboarding processes. This platform provides a multi-step onboarding flow for entrepreneurs to submit their project applications with team member management, program selection, and application tracking.

## 🚀 Features

### Core Functionality
- **Multi-step Onboarding Process**: 7-step application flow for startup projects
- **User Authentication**: Secure login/signup with NextAuth.js
- **Role-based Access Control**: Admin and entrepreneur user roles
- **User Management**: Comprehensive user administration with filtering and search
- **Team Management**: Add and manage team members with detailed information
- **Program Selection**: Choose from different startup programs (Inqubalab, Idea Feedback, Aceleración)
- **Application Tracking**: View and manage submitted applications
- **Form Validation**: Comprehensive validation using Zod schemas
- **Progress Tracking**: Visual progress indicators and step navigation
- **Responsive Design**: Mobile-first design with Tailwind CSS

### User Roles & Access
- **Entrepreneurs**: Submit applications, manage team, track progress
- **Admins**: Review applications, manage users, system administration, user management
- **Protected Routes**: Role-based access control for different sections
- **User Management**: Admin-only access to user administration features

### Onboarding Steps
1. **Program Selection** - Choose startup program type
2. **General Data** - Project name, website, category, industry, description
3. **Impact & Origin** - Opportunity value, stage, project origin, problem statement
4. **Presentation** - Video upload and specific support requirements
5. **Team** - Team member management with academic and contact information
6. **Preferences** - Personal preferences (sports, hobbies, movie genres)
7. **Consent** - Privacy policy acceptance

### Application Management
- **Application Dashboard**: View all submitted applications
- **Status Tracking**: Monitor application progress and status
- **Team Overview**: Manage team members and their information
- **Settings**: User profile and application preferences
- **Individual Application View**: Detailed view of specific applications
- **Advanced Filtering**: Filters (such as status and program) can be initialized from URL query parameters (e.g., `?projectStatus=created`) and are kept in sync with the UI and API. Filter state is controlled at the page level for consistency and performance.

### User Management
- **User Dashboard**: Comprehensive user administration interface
- **User Data Table**: Paginated user list with advanced filtering and search
- **Role-based Filtering**: Filter users by role (Entrepreneur, Admin)
- **Academic Information**: Display university and team member details
- **Account Status**: Monitor user account status (Active, Locked, Failed attempts)
- **User Actions**: View, edit, and manage user accounts
- **Security Features**: Password protection and sensitive data handling
- **Advanced Filtering**: Filters can be initialized from URL query parameters and are kept in sync with the UI and API. All filter state is managed at the page level.

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **SWR** - Data fetching and caching
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma** - Database ORM with Accelerate extension
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication solution with Prisma adapter

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Package manager
- **Prisma Studio** - Database management interface

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and management
│   ├── api/               # API routes
│   │   ├── applications/  # Application management API
│   │   │   └── [id]/      # Individual application CRUD operations
│   │   ├── programs/      # Programs management API
│   │   ├── auth/          # Authentication endpoints
│   │   ├── onboarding/    # Onboarding API
│   │   ├── users/         # User management API
│   │   ├── team-members/  # Team members API
│   │   ├── internal/      # Internal/admin API endpoints
│   ├── applications/      # Application tracking page
│   ├── dashboard/         # User dashboard (role-based)
│   ├── entrepreneur/      # Entrepreneur-specific pages
│   ├── login/             # Login page
│   ├── onboarding/        # Onboarding flow
│   │   └── [programId]/   # Dynamic onboarding steps and logic
│   │       ├── steps/     # Step components (ProgramSelection, GeneralData, ImpactOrigin, Presentation, Team, Preferences, Consent)
│   │       ├── form-schema.ts # Zod schema and types for onboarding
│   │       ├── utils.ts   # Onboarding utilities
│   │       └── page.tsx   # Main onboarding flow (handles conditional metrics step)
│   ├── settings/          # User settings and profile
│   ├── team/              # Team management
│   ├── users/             # User management interface
│   └── test-onboarding/   # Testing environment
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # Shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── api/              # API utilities and transformers
│   │   ├── applications/ # Application API functions and transformers
│   │   └── users/        # User API functions and transformers
│   ├── auth/             # Authentication utilities
│   ├── middleware/       # Middleware utilities
│   ├── utils/            # Helper functions
│   └── zod/              # Zod schema definitions
└── prisma/               # Database schema and migrations
```

### Main API Endpoints Implemented

- `/api/applications` — List, filter, and create project applications
- `/api/applications/[id]` — Get, update, or delete a specific application
- `/api/applications/[id]/status` — Update application status (admin only)
- `/api/applications/[id]/route.ts` — Handles GET, PUT, DELETE for applications
- `/api/programs` — List, create, and manage programs
- `/api/users` — List, filter, and manage users
- `/api/team-members` — List and manage team members for applications
- `/api/internal` — Internal endpoints for system or admin operations
- `/api/onboarding/[step]` — Get or save onboarding step data
- `/api/onboarding/current-step` — Get current onboarding step for a user/program
- `/api/onboarding/status` — Get onboarding status
- `/api/auth/[...nextauth]` — NextAuth.js authentication endpoints
- `/api/auth/signup` — User registration

- The onboarding step for "Métricas de tu Startup" is conditionally rendered in `onboarding/[programId]/page.tsx` only for programs of type "aceleracion". There is no static `StepMetrics.tsx` file in the steps folder.

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

   # Upstash
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=
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
- Role-based access control (admin, entrepreneur)
- Session management

#### ProjectApplication
- Multi-step onboarding data
- Program selection and project details
- Team member relationships
- Application status tracking

#### TeamMember
- Detailed team member information
- Academic details (university, career, cycle)
- Contact information and social links

#### StatusLog
- Application status history
- Status change tracking
- Timestamp and user information

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:migrate:deploy # Deploy migrations to production
pnpm db:migrate:reset # Reset database and run migrations
pnpm db:migrate:status # Check migration status
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
pnpm db:format        # Format Prisma schema
pnpm db:validate      # Validate Prisma schema
```

## 🔐 Authentication

The application uses NextAuth.js with the following providers:
- **Credentials Provider** - Email/password authentication
- **Google Provider** - OAuth authentication (commented out by default)
- **Prisma Adapter** - Database session and account management

### Authentication Flow
1. User registers with email and password
2. Password is hashed using bcryptjs
3. JWT tokens are used for session management
4. Protected routes check for valid sessions and user roles

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Onboarding
- `GET /api/onboarding/[step]` - Get step data
- `POST /api/onboarding/[step]` - Save step data
- `GET /api/onboarding/current-step` - Get current step
- `GET /api/onboarding/status` - Get onboarding status

### Applications
- `GET /api/applications` - Get all applications with filtering and pagination
- `GET /api/applications/[id]` - Get specific application by ID
- `PUT /api/applications/[id]` - Update application by ID
- `DELETE /api/applications/[id]` - Delete application by ID

#### Application API Features
- **Filtering**: By program type, category, industry, stage, status, completion
- **Search**: Full-text search across project names, descriptions, team members
- **Sorting**: By any application field in ascending or descending order
- **Pagination**: Configurable page size with navigation
- **Detailed Views**: Complete application data with team members and status history
- **CRUD Operations**: Full Create, Read, Update, Delete functionality

### Users
- `GET /api/users` - Get all users with filtering and pagination

#### User API Features
- **Filtering**: By role (entrepreneur, admin) and project application ID
- **Search**: Full-text search across user names, emails, and team member information
- **Sorting**: By user fields (createdAt, updatedAt, firstname, lastname, email, role)
- **Pagination**: Configurable page size with navigation
- **Security**: Password exclusion and sensitive data protection
- **University Display**: Enhanced university information with display values
- **Team Member Data**: Complete team member information with academic details
- **Prisma Query Best Practice**: Always use `teamMembers` (plural) in Prisma user queries. Using `teamMember` (singular) will result in a type error.

## 🎨 UI Components

The project uses Shadcn/ui components with Tailwind CSS:

- **Form Components**: Input, Textarea, Select, RadioGroup, Checkbox, Form
- **Layout Components**: Card, Button, Steps, Accordion, Collapsible
- **Navigation**: Breadcrumb, Menu, Menubar, Dropdown Menu
- **Feedback**: Alert, Dialog, Progress, Skeleton
- **Data Display**: Table, Avatar, Badge, Calendar
- **Media**: Aspect Ratio, Carousel
- **Data Table Filters**: Includes `DataTableDropdownFacetedFilter` (for API-driven dropdown filters with search and async data) and improved `DataTableFacetedFilter` (now supports external state, query string-driven initial state, and table integration). All filter state and API calls are managed at the page level for performance and consistency.

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Zod schemas for all form inputs
- **Session Management**: Secure JWT-based sessions with Prisma adapter
- **CSRF Protection**: Built-in NextAuth.js protection
- **Rate Limiting**: Login attempt tracking
- **Role-based Access**: Middleware protection for different user roles
- **API Security**: Password exclusion in user API responses
- **Authentication Required**: All API endpoints require valid sessions

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

### Application Status Management
- Status tracking with history
- Role-based status updates
- Validation for status transitions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch
4. Configure Prisma Accelerate for production database

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
- **v0.2.0** - Enhanced application management
  - Application tracking system
  - Admin dashboard
  - Role-based access control
  - Settings and team management pages
  - Status tracking with history
- **v0.3.0** - Complete application CRUD API
  - Individual application retrieval by ID
  - Full CRUD operations for applications
  - Enhanced data transformers
  - Comprehensive API documentation
- **v0.4.0** - User Management System
  - Comprehensive user administration interface
  - User data table with advanced filtering and search
  - Role-based filtering (Entrepreneur, Admin)
  - University display integration
  - Account status monitoring
  - Secure API with password protection
  - Data transformers for enhanced user information

---

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS v4**
