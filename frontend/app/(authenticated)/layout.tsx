import RightSidebar from "@/components/right-sidebar/RightSidebar";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <RightSidebar />
      <main className="h-full px-[12.5%] lg:px-[33.3333%]">
        {children}
      </main>
    </>
  )
}
