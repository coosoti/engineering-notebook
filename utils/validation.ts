export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, one uppercase, one lowercase, one number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return re.test(password)
}

export function validateSlug(slug: string): boolean {
  // Only lowercase letters, numbers, and hyphens
  const re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return re.test(slug)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (_) {
    return false
  }
}