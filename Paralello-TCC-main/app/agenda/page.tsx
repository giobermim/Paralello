"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import Image from "next/image"

export default function AgendaPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[rgba(1,176,255,1)]">
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full overflow-hidden">
          <div className="rounded-3xl bg-background p-8 shadow-lg h-full flex items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center justify-center space-y-6">
              <Image
                src="/images/design-mode/img_lapiscinza.png"
                alt="Personagem lápis Paralello"
                width={300}
                height={300}
                className="object-contain"
              />

              <h1 className="text-center text-3xl font-bold text-muted-foreground">
                Comece seus estudos com Paralello!
              </h1>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
