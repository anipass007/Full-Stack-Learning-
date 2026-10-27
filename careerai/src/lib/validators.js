export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

export function isPhone(value) {
  return /^[+\d][\d\s-]{6,15}$/.test(value.trim())
}

export function isHttpUrl(value) {
  return /^https?:\/\/\S+\.\S+/i.test(value.trim())
}

export function passwordChecks(password) {
  return {
    length: password.length >= 8,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
  }
}

// 0 (empty) to 4 (strong). Used for the signup strength meter.
export function passwordStrength(password) {
  if (!password) return 0
  const checks = passwordChecks(password)
  let score = 0
  if (checks.length) score += 1
  if (checks.letter && checks.number) score += 1
  if (password.length >= 12) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}
