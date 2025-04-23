// src/components/ProtectedRoute.jsx
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div>Loading...</div> // Or your custom loading component
  }

  if (!session) {
    // Redirect to login page with callback URL
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`)
    return null
  }

  return children
}