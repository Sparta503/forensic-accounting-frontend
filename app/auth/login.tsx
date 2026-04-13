import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";

const router = useRouter();

// After receiving token from backend
localStorage.setItem("token", res.data.access_token);

const user = getUserFromToken();

if (user?.role === "admin") {
  router.push("/dashboard/admin");
} else if (user?.role === "auditor") {
  router.push("/dashboard/auditor");
} else {
  router.push("/dashboard/user");
}