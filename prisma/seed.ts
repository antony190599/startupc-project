import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const categories = [
    {
      name: 'Technology',
      description: 'Latest tech news and insights',
      slug: 'technology',
      color: '#3B82F6',
    },
    {
      name: 'Business',
      description: 'Business strategies and entrepreneurship',
      slug: 'business',
      color: '#10B981',
    },
    {
      name: 'Design',
      description: 'UI/UX design and creative content',
      slug: 'design',
      color: '#F59E0B',
    },
    {
      name: 'Marketing',
      description: 'Digital marketing and growth strategies',
      slug: 'marketing',
      color: '#EF4444',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Create tags
  const tags = [
    { name: 'Next.js', slug: 'nextjs', color: '#000000' },
    { name: 'React', slug: 'react', color: '#61DAFB' },
    { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    { name: 'Tailwind CSS', slug: 'tailwind-css', color: '#06B6D4' },
    { name: 'Prisma', slug: 'prisma', color: '#2D3748' },
    { name: 'Authentication', slug: 'authentication', color: '#E53E3E' },
    { name: 'Database', slug: 'database', color: '#38A169' },
    { name: 'API', slug: 'api', color: '#805AD5' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      firstname: 'Admin',
      lastname: 'User',
      password: adminPassword,
      role: 'admin',
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'System administrator with full access rights',
          location: 'San Francisco, CA',
          website: 'https://example.com',
          twitter: '@adminuser',
          github: 'adminuser',
          linkedin: 'adminuser',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  // Create entrepreneur user
  const entrepreneurPassword = await hashPassword('password123');
  const entrepreneur = await prisma.user.upsert({
    where: { email: 'entrepreneur@example.com' },
    update: {},
    create: {
      email: 'entrepreneur@example.com',
      firstname: 'Entrepreneur',
      lastname: 'User',
      password: entrepreneurPassword,
      role: 'entrepreneur',
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Full-stack developer passionate about building great products',
          location: 'Miami, FL',
          website: 'https://myproject.com',
          twitter: '@entrepreneur',
          github: 'entrepreneur',
          linkedin: 'entrepreneur',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  // Create sample posts
  const posts = [
    {
      title: 'Getting Started with Next.js 14',
      content: `# Getting Started with Next.js 14

Next.js 14 introduces several exciting new features that make building React applications even more powerful and efficient.

## Key Features

- **App Router**: The new app directory provides a more intuitive way to organize your application
- **Server Components**: Built-in support for React Server Components
- **Turbopack**: Faster bundling and development experience
- **Improved TypeScript Support**: Better type safety and developer experience

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npm run dev
\`\`\`

This will create a new Next.js project with TypeScript, Tailwind CSS, and the App Router enabled.

## Next Steps

1. Explore the app directory structure
2. Learn about Server and Client Components
3. Set up your database with Prisma
4. Add authentication with NextAuth.js

Happy coding! 🚀`,
      slug: 'getting-started-with-nextjs-14',
      excerpt: 'Learn how to get started with Next.js 14 and its new features including the App Router and Server Components.',
      published: true,
      featured: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: (await prisma.category.findUnique({ where: { slug: 'technology' } }))?.id,
    },
    {
      title: 'Building a Modern Authentication System',
      content: `# Building a Modern Authentication System

Authentication is a crucial part of any web application. In this post, we'll explore how to build a robust authentication system using Next.js, NextAuth.js, and Prisma.

## Why NextAuth.js?

NextAuth.js provides a complete authentication solution for Next.js applications with:

- Multiple authentication providers (Google, GitHub, etc.)
- JWT and database sessions
- Built-in security features
- TypeScript support

## Setting Up NextAuth.js

First, install the required dependencies:

\`\`\`bash
npm install next-auth @auth/prisma-adapter
\`\`\`

Then configure your authentication options and set up the Prisma adapter.

## Database Schema

Your Prisma schema should include the necessary tables for NextAuth.js:

\`\`\`prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  // ... other fields
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  // ... relations
}
\`\`\`

## Security Best Practices

1. Use environment variables for sensitive data
2. Implement proper session management
3. Add rate limiting to authentication endpoints
4. Use HTTPS in production
5. Regularly update dependencies

Remember, security is not a one-time setup but an ongoing process! 🔒`,
      slug: 'building-modern-authentication-system',
      excerpt: 'Learn how to build a secure authentication system using Next.js, NextAuth.js, and Prisma with best practices.',
      published: true,
      featured: false,
      publishedAt: new Date(Date.now() - 86400000), // 1 day ago
      authorId: entrepreneur.id,
      categoryId: (await prisma.category.findUnique({ where: { slug: 'technology' } }))?.id,
    },
  ];

  for (const post of posts) {
    const createdPost = await prisma.post.create({
      data: post,
    });

    // Add tags to posts
    const technologyTags = await prisma.tag.findMany({
      where: {
        slug: {
          in: ['nextjs', 'react', 'typescript', 'authentication'],
        },
      },
    });

    await prisma.post.update({
      where: { id: createdPost.id },
      data: {
        tags: {
          connect: technologyTags.map((tag) => ({ id: tag.id })),
        },
      },
    });
  }

  // Create project application for entrepreneur
  const projectApplication = await prisma.projectApplication.create({
    data: {
      onboardingStep: 'program-selection',
      programType: 'inqubalab',
      projectName: 'Eco Startup',
      category: 'tech',
      industry: 'energia',
      users: {
        connect: { id: entrepreneur.id },
      },
    },
  });

  // Create team member for entrepreneur
  await prisma.teamMember.create({
    data: {
      projectApplicationId: projectApplication.id,
      userId: entrepreneur.id,
      firstName: entrepreneur.firstname || 'Entrepreneur',
      lastName: entrepreneur.lastname || 'User',
      contactEmail: entrepreneur.email || 'entrepreneur@example.com',
      dni: '12345678',
      phone: '123456789',
      university: 'upc',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Created admin user: ${admin.email}`);
  console.log(`👤 Created entrepreneur user: ${entrepreneur.email}`);
  console.log(`📝 Created ${posts.length} sample posts`);
  console.log(`🏷️  Created ${categories.length} categories and ${tags.length} tags`);
  console.log(`🚀 Created sample project application for entrepreneur`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
