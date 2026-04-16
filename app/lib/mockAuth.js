export function mockLogin(email, password, role) {
  const user = {
    user_id: "123",
    email,
    role: role || (email.includes("admin")
      ? "admin"
      : email.includes("auditor")
      ? "auditor"
      : "management"),
  };

  return btoa(JSON.stringify(user));
}

export function mockRegister(email, password, role) {
  return {
    email,
    role,
    message: "User created (mock)",
  };
}