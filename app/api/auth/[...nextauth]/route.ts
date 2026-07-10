import { handlers } from "@/lib/auth"

export async function GET(request: Request) {
  console.log('SENTRY: Auth API GET request received')
  return handlers.GET(request)
}

export async function POST(request: Request) {
  console.log('SENTRY: Auth API POST request received')
  return handlers.POST(request)
}
