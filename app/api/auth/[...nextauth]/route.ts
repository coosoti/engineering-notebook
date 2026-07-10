import { handlers } from "@/lib/auth"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  console.log('SENTRY: Auth API GET request received')
  return handlers.GET(request)
}

export async function POST(request: NextRequest) {
  console.log('SENTRY: Auth API POST request received')
  return handlers.POST(request)
}
