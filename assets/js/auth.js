/* ===========================================================
   auth.js
   Lógica de autenticación: login, registro, logout,
   recuperación de contraseña. Persistencia en localStorage.
   Depende de: data.js, main.js
   =========================================================== */

function login(email, password, remember = false) {
  const user = findUserByEmail(email);
  if (!user) return { ok: false, message: 'El correo no está registrado.' };
  if (user.password !== password) return { ok: false, message: 'La contraseña es incorrecta.' };

  setSession(user);
  if (remember) localStorage.setItem('camping_remember', user.email);
  return { ok: true, user };
}

function register(data) {
  const required = ['nombre', 'apellidos', 'email', 'password', 'telefono', 'dni'];
  for (const k of required) {
    if (!data[k] || !String(data[k]).trim()) return { ok: false, message: 'Faltan datos obligatorios.' };
  }
  if (!isEmail(data.email)) return { ok: false, message: 'El correo no es válido.' };
  if (!isStrongPassword(data.password)) return { ok: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
  if (data.password !== data.passwordConfirm) return { ok: false, message: 'Las contraseñas no coinciden.' };
  if (!isPhone(data.telefono)) return { ok: false, message: 'El teléfono no es válido.' };
  if (String(data.dni).length < 6) return { ok: false, message: 'El DNI no es válido.' };
  if (findUserByEmail(data.email)) return { ok: false, message: 'Este correo ya está registrado.' };

  const users = getUsers();
  const newUser = {
    id: generateId('usr'),
    nombre: data.nombre.trim(),
    apellidos: data.apellidos.trim(),
    dni: data.dni.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    telefono: data.telefono.trim(),
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  setSession(newUser);
  return { ok: true, user: newUser };
}

function logout() {
  clearSession();
  toast('Sesión cerrada', 'info');
  setTimeout(() => { window.location.href = BASE + 'index.html'; }, 600);
}

function recoverPassword(email) {
  if (!isEmail(email)) return { ok: false, message: 'Ingresa un correo válido.' };
  const user = findUserByEmail(email);
  if (!user) return { ok: true, message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' };
  return { ok: true, message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' };
}

function getCurrentUser() {
  const session = getSession();
  return session ? findUserById(session.userId) : null;
}

function updateProfile(patch) {
  const session = getSession();
  if (!session) return { ok: false, message: 'No hay sesión activa.' };
  const users = getUsers();
  const idx = users.findIndex(u => u.id === session.userId);
  if (idx === -1) return { ok: false, message: 'Usuario no encontrado.' };

  if (patch.email && !isEmail(patch.email)) return { ok: false, message: 'Email inválido.' };
  if (patch.email && findUserByEmail(patch.email) && patch.email !== users[idx].email) {
    return { ok: false, message: 'Ese correo ya está en uso.' };
  }

  users[idx] = { ...users[idx], ...patch, email: patch.email ? patch.email.trim().toLowerCase() : users[idx].email };
  saveUsers(users);
  return { ok: true, user: users[idx] };
}