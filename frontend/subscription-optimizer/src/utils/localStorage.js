// Get all users from localStorage
export const getUsers = () => {
  const users = localStorage.getItem('users')
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users))
}

// Register new user
export const registerUser = (userData) => {
  const users = getUsers()
  
  // Check if email exists
  const existingUser = users.find(user => user.email === userData.email)
  if (existingUser) {
    return { success: false, message: 'Email already registered' }
  }
  
  // Add new user
  const newUser = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    password: userData.password
  }
  
  users.push(newUser)
  saveUsers(users)
  
  return { success: true, message: 'Registration successful' }
}

// Login user
export const loginUser = (email, password) => {
  const users = getUsers()
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password)
  
  if (!user) {
    return { success: false, message: 'Invalid Email or Password' }
  }
  
  // Save login session
  localStorage.setItem('currentUser', JSON.stringify(user))
  localStorage.setItem('isLoggedIn', 'true')
  
  return { success: true, message: 'Login successful', user }
}

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser')
  return user ? JSON.parse(user) : null
}

// Check if logged in
export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true'
}

// Logout
export const logout = () => {
  localStorage.removeItem('currentUser')
  localStorage.removeItem('isLoggedIn')
}