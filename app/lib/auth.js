export function getUserFromToken() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // pad
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");

    const json = atob(padded);
    const payloadObj = JSON.parse(json);

    const rawRole =
      payloadObj?.role ??
      payloadObj?.Role ??
      payloadObj?.user_role ??
      payloadObj?.userRole ??
      payloadObj?.user_type ??
      payloadObj?.userType ??
      null;

    const normalizedRole = typeof rawRole === "string" ? rawRole.trim().toLowerCase() : null;
    const role =
      normalizedRole === "manager" || normalizedRole === "management"
        ? "management"
        : normalizedRole === "auditor"
          ? "auditor"
          : normalizedRole === "admin" || normalizedRole === "administrator"
            ? "admin"
            : normalizedRole;

    const override = localStorage.getItem("app_role");
    const overrideRole = typeof override === "string" ? override.trim().toLowerCase() : "";
    const finalRole = overrideRole || role;

    return {
      ...payloadObj,
      ...(finalRole ? { role: finalRole } : {}),
    };
  } catch {
    return null;
  }
}