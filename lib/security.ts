import DOMPurify from 'isomorphic-dompurify'
import crypto from 'crypto'

/**
 * Sanitizes HTML content to prevent XSS attacks.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html)
}

/**
 * Hashes an IP address to protect PII while maintaining the ability
 * to identify unique users/sessions.
 */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null

  // We use a salt to prevent rainbow table attacks on common IPs
  const salt = process.env.IP_SALT || 'default-salt-for-dev'
  return crypto
    .createHmac('sha256', salt)
    .update(ip)
    .digest('hex')
}
