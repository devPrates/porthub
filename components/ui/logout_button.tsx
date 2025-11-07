"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      variant="destructive"
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
      {loading ? (
        <>
          <Spinner className="mr-2" />
          Saindo...
        </>
      ) : (
        "Sair"
      )}
    </Button>
  )
}