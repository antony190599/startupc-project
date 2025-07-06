import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useRoleCheck(requiredRole: string | string[]) {
  const { data: session, status } = useSession();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const isLoading = status === "loading";

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = session.user.role || "";
      
      if (Array.isArray(requiredRole)) {
        setIsAuthorized(requiredRole.includes(userRole));
      } else {
        setIsAuthorized(userRole === requiredRole);
      }
    } else if (status === "unauthenticated") {
      setIsAuthorized(false);
    }
  }, [session, status, requiredRole]);

  return { isAuthorized, isLoading };
}
