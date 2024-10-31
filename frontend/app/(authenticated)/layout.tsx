import Sidebar from "@/components/sidebar/Sidebar"

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <main className="pl-[33.3333%] h-full">{children}</main>
    </>
  )
}
