"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  
  useEffect(() => {
    if(user && !roles.includes(user.role)) {
      router.push("/access-denied");
    }
  }, [user, roles, router]);

  if (!user || !roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
