import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { ProjectStatus } from "@/lib/enum";

export async function POST(request: NextRequest) {
  try {
    const { firstname, lastname, email, password } = await request.json();

    // Validate input
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 409 }
      );
    }    

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Transaction: create user, project application, and team member
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstname,
          lastname,
          email,
          role: "entrepreneur", // Asignamos explícitamente el rol entrepreneur
          password: hashedPassword,
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      /*

      const projectApplication = await tx.projectApplication.create({
        data: {
          onboardingStep: "program-selection", // Cambio a formato correcto
          projectStatus: ProjectStatus.CREATED,
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      const teamMember = await tx.teamMember.create({
        data: {
          projectApplicationId: projectApplication.id,
          userId: user.id,
          firstName: user.firstname as string,
          lastName: user.lastname as string,
          contactEmail: user.email as string, // Use user's email as contact email
        },
      });

      */

      return { 
        user, 
        //projectApplication, 
        //teamMember 
      };
    });

    // Create a session for the newly registered user
    // We'll use Next Auth's signIn function to create a proper session
    const response = NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: result.user.id,
          firstname: result.user.firstname,
          lastname: result.user.lastname,
          email: result.user.email,
          role: result.user.role,
        },
        autoLogin: true, // Flag to indicate automatic login should happen
      },
      { status: 201 }
    );

    return response;
  } catch (error) {
    console.error("Error en signup:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}