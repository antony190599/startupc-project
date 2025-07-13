import { PrismaClient } from '@prisma/client'
import { ProgramTypes } from '../lib/enum'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create programs
  console.log('📚 Creating programs...')
  const programs = [
    {
      name: 'Inqubalab 2025',
      description: 'Programa de incubación para ideas de negocio. Ayudamos a emprendedores a desarrollar y validar sus ideas de negocio desde la concepción hasta el MVP.',
      programType: ProgramTypes.INQUBALAB,
      programStatus: 'active',
      year: '2025',
      cohortCode: '2025-1',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-08-31'),
      status: 'published',
    },
    {
      name: 'Idea Feedback 2025',
      description: 'Programa de retroalimentación para ideas. Recibe feedback experto y valida tu idea de negocio antes de comenzar el desarrollo.',
      programType: ProgramTypes.IDEA_FEEDBACK,
      programStatus: 'active',
      year: '2025',
      cohortCode: '2025-1',
      startDate: new Date('2025-02-15'),
      endDate: new Date('2025-04-15'),
      status: 'published',
    },
    {
      name: 'Aceleración 2025',
      description: 'Programa de aceleración para startups. Acelera el crecimiento de tu startup con mentoría, networking y recursos especializados.',
      programType: ProgramTypes.ACELERACION,
      programStatus: 'active',
      year: '2025',
      cohortCode: '2025-1',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-11-30'),
      status: 'published',
    },
  ]

  const createdPrograms = []
  for (const programData of programs) {
    const program = await prisma.program.create({
      data: programData,
    })
    createdPrograms.push(program)
    console.log(`📚 Created program: ${program.name}`)
  }

  return;

  // Create sample users
  const users = [
    {
      email: 'admin@startupc.com',
      firstname: 'Admin',
      lastname: 'User',
      role: 'admin',
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Administrator of StartupC platform',
          location: 'Lima, Peru',
          website: 'https://startupc.com',
          twitter: '@startupc_admin',
          github: 'startupc-admin',
          linkedin: 'startupc-admin',
        },
      },
    },
    {
      email: 'entrepreneur@example.com',
      firstname: 'María',
      lastname: 'García',
      role: 'entrepreneur',
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Emprendedora apasionada por la tecnología y la innovación',
          location: 'Lima, Peru',
          website: 'https://mariagarcia.com',
          twitter: '@mariagarcia',
          github: 'mariagarcia',
          linkedin: 'mariagarcia',
        },
      },
    },
    {
      email: 'student@upc.edu.pe',
      firstname: 'Carlos',
      lastname: 'Rodríguez',
      role: 'entrepreneur',
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Estudiante de Ingeniería de Sistemas en UPC',
          location: 'Lima, Peru',
          website: null,
          twitter: '@carlosrodriguez',
          github: 'carlosrodriguez',
          linkedin: 'carlosrodriguez',
        },
      },
    },
  ]

  const createdUsers = []
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
      include: {
        profile: true,
      },
    })
    createdUsers.push(user)
    console.log(`👤 Created user: ${user.email}`)
  }

  // Create sample project applications
  const projectApplications = [
    {
      programType: 'inqubalab',
      projectName: 'EcoTech Solutions',
      website: 'https://ecotechsolutions.com',
      category: 'tech',
      industry: 'ambiental',
      description: 'Plataforma de monitoreo ambiental usando IoT y AI para empresas sostenibles',
      ruc: '20123456789',
      foundingYear: '2023',
      opportunityValue: 'Mercado de $50M en Latinoamérica',
      stage: 'mvp',
      projectOrigin: 'ideaEmprendimiento',
      problem: 'Las empresas no tienen visibilidad en tiempo real de su impacto ambiental',
      customerProfile: 'Empresas medianas y grandes comprometidas con la sostenibilidad',
      impact: 'Reducción del 30% en huella de carbono de las empresas',
      videoUrl: 'https://youtube.com/watch?v=sample1',
      videoFileName: 'ecotech_presentation.mp4',
      specificSupport: 'Mentoría en go-to-market y conexiones con empresas',
      howMet: 'Universidad',
      source: 'universidad',
      favoriteSport: 'futbol',
      favoriteHobby: 'lectura',
      favoriteMovieGenre: 'cienciaFiccion',
      privacyConsent: true,
      onboardingStep: 'completed',
    },
    {
      programType: 'idea-feedback',
      projectName: 'HealthConnect',
      website: 'https://healthconnect.pe',
      category: 'tech',
      industry: 'biotecnologia',
      description: 'App móvil para conectar pacientes con especialistas médicos',
      ruc: '20123456790',
      foundingYear: '2024',
      opportunityValue: 'Mercado de $100M en Perú',
      stage: 'ideaNegocio',
      projectOrigin: 'proyectoTesis',
      problem: 'Acceso limitado a especialistas médicos en zonas remotas',
      customerProfile: 'Pacientes de 25-65 años con acceso a smartphones',
      impact: 'Mejora del 40% en acceso a atención médica especializada',
      videoUrl: 'https://youtube.com/watch?v=sample2',
      videoFileName: 'healthconnect_presentation.mp4',
      specificSupport: 'Validación de mercado y desarrollo de MVP',
      howMet: 'Amigos',
      source: 'amigos',
      favoriteSport: 'basketball',
      favoriteHobby: 'musica',
      favoriteMovieGenre: 'drama',
      privacyConsent: true,
      onboardingStep: 'completed',
    },
  ]

  const createdApplications = []
  for (const appData of projectApplications) {
    const application = await prisma.projectApplication.create({
      data: appData,
    })
    createdApplications.push(application)
    console.log(`📋 Created project application: ${application.projectName}`)
  }

  // Create team members for the first project
  const teamMembers = [
    {
      firstName: 'María',
      lastName: 'García',
      dni: '12345678',
      contactEmail: 'maria.garcia@ecotech.com',
      phone: '+51 999 123 456',
      university: 'upc',
      career: 'Ingeniería de Sistemas',
      cycle: '10',
      studentCode: 'U202012345',
      universityEmail: 'maria.garcia@upc.edu.pe',
      linkedin: 'maria-garcia-ecotech',
      projectApplicationId: createdApplications[0].id,
      userId: createdUsers[1].id, // María García
    },
    {
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      dni: '87654321',
      contactEmail: 'carlos.rodriguez@ecotech.com',
      phone: '+51 999 654 321',
      university: 'upc',
      career: 'Ingeniería Industrial',
      cycle: '9',
      studentCode: 'U202098765',
      universityEmail: 'carlos.rodriguez@upc.edu.pe',
      linkedin: 'carlos-rodriguez-ecotech',
      projectApplicationId: createdApplications[0].id,
      userId: createdUsers[2].id, // Carlos Rodríguez
    },
  ]

  for (const memberData of teamMembers) {
    const teamMember = await prisma.teamMember.create({
      data: memberData,
    })
    console.log(`👥 Created team member: ${teamMember.firstName} ${teamMember.lastName}`)
  }

  // Update users to link them to their project applications
  await prisma.user.update({
    where: { id: createdUsers[1].id },
    data: { projectApplications: { connect: [{ id: createdApplications[0].id }] } },
  })

  await prisma.user.update({
    where: { id: createdUsers[2].id },
    data: { projectApplications: { connect: [{ id: createdApplications[0].id }] } },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📚 Created ${createdPrograms.length} programs`)
  console.log(`👤 Created ${createdUsers.length} users`)
  console.log(`📋 Created ${createdApplications.length} project applications`)
  console.log(`👥 Created ${teamMembers.length} team members`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 