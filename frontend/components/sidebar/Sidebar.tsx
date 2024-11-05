import useAuthStore from "@/stores/authStore";
import SidebarRoutes from "./SidebarRoutes";

const Sidebar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className={`h-full w-1/3 fixed ${!isAuthenticated && "hidden"}`}>
      <SidebarRoutes />
    </div>
  )
};

export default Sidebar;
