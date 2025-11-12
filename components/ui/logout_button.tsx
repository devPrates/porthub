"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Power } from "lucide-react"

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      variant="softDestructive"
      size="icon"
      type="button"
      aria-label="Sair"
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true)
          await signOut({ callbackUrl: "/" })
        } finally {
          setLoading(false)
        }
      }}
    >
      {loading ? <Spinner /> : <Power className="h-4 w-4" />}
    </Button>
  )
}
