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

const CURRENT_USER_KEY = 'redstream_user_id'

function stripPassword(user) {
  if (!user) return null
  const { password, ...safeUser } = user
  return safeUser
}

export function getUserById(id) {
  const user = users.find((entry) => entry.id === id)
  return stripPassword(user)
}

export function setCurrentUser(id) {
  localStorage.setItem(CURRENT_USER_KEY, id)
}

export function getCurrentUser() {
  const id = localStorage.getItem(CURRENT_USER_KEY)
  if (!id) return null
  return getUserById(id)
}

export function updateUser(id, updates) {
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) return { error: 'User not found.' }

  const currentUser = users[index]
  const normalizedEmail = updates.email ? normalizeEmail(updates.email) : currentUser.email

  if (
    normalizedEmail !== currentUser.email &&
    users.some((user) => user.email === normalizedEmail && user.id !== id)
  ) {
    return { error: 'This email is already in use.' }
  }

  if (!updates.name?.trim()) {
    return { error: 'Name is required.' }
  }

  if (!Number.isInteger(Number(updates.age)) || Number(updates.age) < 13) {
    return { error: 'Enter an age of 13 or older.' }
  }

  users[index] = {
    ...currentUser,
    name: updates.name.trim(),
    email: normalizedEmail,
    age: Number(updates.age),
  }

  return { user: stripPassword(users[index]) }
}
