export const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'USD 2.99',
    quality: 'Good video quality',
    devices: 'Watch on 1 device',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'USD 7.99',
    quality: 'Best video quality',
    devices: 'Watch on 4 devices',
  },
]

const users = [
  {
    id: 'demo-user',
    name: 'Demo User',
    age: 24,
    email: 'demo@redstream.com',
    password: 'password123',
    plan: 'premium',
  },
]

const normalizeEmail = (email) => email.trim().toLowerCase()

export function userExists(email) {
  const normalizedEmail = normalizeEmail(email)
  return users.some((user) => user.email === normalizedEmail)
}

export function addUser(user) {
  const newUser = {
    ...user,
    id: crypto.randomUUID(),
    age: Number(user.age),
    email: normalizeEmail(user.email),
  }

  users.push(newUser)
  return newUser
}

export function verifyUser(email, password) {
  const normalizedEmail = normalizeEmail(email)
  return users.find((user) => user.email === normalizedEmail && user.password === password) ?? null
}
