// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "../lib/auth"
import { NextResponse } from "next/server"

const handler = NextAuth(authOptions)

export async function GET(req: Request) {
  try {
    return await handler(req)
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    return await handler(req)
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 500 }
    )
  }
}