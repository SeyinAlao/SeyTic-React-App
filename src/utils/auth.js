export function signup(email, password, name) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const exists = users.find((user) => user.email === email);

  if (exists) return { success: false, message: 'Email already exists' };

  users.push({ email, password, name });
  localStorage.setItem('users', JSON.stringify(users));

  return { success: true };
}

export function login(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true };
  }

  return { success: false, message: 'Invalid credentials' };
}

export function getSession() {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? JSON.parse(currentUser) : null;
}

export function logout() {
  localStorage.removeItem('currentUser');
}
