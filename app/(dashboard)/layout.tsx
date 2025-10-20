import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="
        flex min-h-screen
        bg-[var(--color-background)]
        text-[var(--color-foreground)]
        transition-colors duration-500
      "
    >
      {/* ✅ Sidebar — visible on all screens, responsive behavior handled inside */}
      <Sidebar />

      {/* ✅ Main Content */}
      <main
        className="
          flex-1 lg:ml-64
          p-4 sm:p-6
          overflow-y-auto
          transition-all duration-500
          bg-[var(--color-background)]
        "
      >
        {children}
      </main>
    </div>
  )
}
