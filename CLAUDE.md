# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbopack (preferred)
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality checks

## Project Architecture

This is a Next.js 15 application using the App Router with TypeScript and Tailwind CSS.

### Technology Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with PostCSS
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Fonts**: Geist Sans and Geist Mono (optimized via next/font)
- **Package Manager**: pnpm (lockfile present)

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global Tailwind styles
│   ├── layout.tsx      # Root layout with font configuration
│   └── page.tsx        # Home page
├── components/
│   └── ui/             # shadcn/ui components
│       └── button.tsx  # Button component with variants
└── lib/
    └── utils.ts        # Utility functions (cn helper)
```

### Key Configuration
- **shadcn/ui**: Configured with New York style, using stone base color
- **Path aliases**: `@/*` maps to `src/*`
- **TypeScript**: Strict mode enabled with Next.js plugin
- **ESLint**: Uses Next.js core web vitals and TypeScript rules
- **Tailwind**: CSS variables enabled for theming

### Component Architecture
- Uses shadcn/ui design system with consistent styling patterns
- Button component demonstrates the cva (class-variance-authority) pattern for variant management
- Utility-first approach with Tailwind CSS and the `cn` helper for class merging
- Components support both direct usage and composition via Radix UI Slot

### Development Notes
- Uses Turbopack for faster development builds
- Icons from Lucide React library
- Responsive design with mobile-first approach
- Dark mode ready with CSS variables