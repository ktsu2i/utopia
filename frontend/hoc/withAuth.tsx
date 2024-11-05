import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, router]);

    if (isAuthenticated === null) {
      return (
        <div className="h-full flex items-center justify-center">
          <TailSpin color="#FF9933" />
        </div>
      );
    }

    return <Component {...props} />;
  }

  return AuthComponent;
};

export default withAuth;
