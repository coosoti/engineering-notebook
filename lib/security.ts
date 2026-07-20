import sanitizeHtmlLib from 'sanitize-html'
import crypto from 'crypto'

/**
 * Sanitizes HTML content to prevent XSS attacks.
 */
export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'em', 'u', 's', 'sub', 'sup',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'blockquote', 'cite', 'q',
      'code', 'pre', 'kbd', 'samp', 'var',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'section', 'article', 'aside',
      'hr'
    ],
    allowedAttributes: {
      '*': ['class', 'id', 'style'],
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
      'code': ['class'],
      'pre': ['class'],
      'th': ['scope'],
      'td': ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedClasses: {
      'code': ['language-*'],
      'pre': ['language-*'],
    },
    transformTags: {
      'a': (tagName: string, attribs: Record<string, string>) => {
        if (attribs.href && attribs.href.startsWith('http')) {
          return { tagName, attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' } }
        }
        return { tagName, attribs }
      }
    }
  })
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
