import { prisma } from "@/lib/db/client"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import { sendEmail } from "@/lib/mail"

export interface UserCreateInput {
  email: string
  name?: string
  role: Role
}

export interface UserUpdateInput {
  name?: string
  role?: Role
  must_change_password?: boolean
}

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { created_at: 'desc' }
  })
}

export async function createUser(data: UserCreateInput) {
  // Generate a temporary random password
  const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
  const passwordHash = await bcrypt.hash(tempPassword, 10)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role,
      password_hash: passwordHash,
      must_change_password: true
    }
  })

  // Send welcome email with temporary password
  const emailResult = await sendEmail({
    to: data.email,
    subject: 'Welcome to the Engineering Notebook',
    text: `Hello ${data.name || 'User'}, your temporary password is: ${tempPassword}. Please change it upon your first login.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #111; border-bottom: 2px solid #eee; padding-bottom: 10px;">Welcome to the Engineering Notebook</h2>
        <p style="color: #666; line-height: 1.5;">Hello ${data.name || 'User'},</p>
        <p style="color: #666; line-height: 1.5;">Your account has been created. Use the credentials below to access the platform:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px dashed #ccc;">
          <span style="font-family: monospace; font-size: 1.2em; font-weight: bold; color: #111;">${tempPassword}</span>
        </div>
        <p style="color: #666; line-height: 1.5;">For security reasons, you will be required to <strong>change this password</strong> immediately after your first login.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
          This is an automated system email. Please do not reply.
        </div>
      </div>
    `,
  })

  return { user, tempPassword, emailSent: emailResult.success }
}

export async function updateUser(id: string, data: UserUpdateInput) {
  return await prisma.user.update({
    where: { id },
    data: data
  })
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id }
  })
}
