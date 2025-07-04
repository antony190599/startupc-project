import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";

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

    // Create user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        role: "business",
        password: hashedPassword,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
      },
    });
    // Create project application
    await prisma.projectApplication.create({
      data: {
        onboardingStep: "seleccion-programa",
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });


    // Create a session for the newly registered user
    // We'll use Next Auth's signIn function to create a proper session
    const response = NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
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