// components/LoginForm.tsx - UPDATE THIS
"use client"

import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useNotification } from "@/app/context/NotificationContext"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import styles from "./LoginForm.module.css"
import Link from "next/link"

export const LoginForm = () => {
  const { addNotification } = useNotification()
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {data:session, status} = useSession()
  
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        addNotification("Invalid email or password", "error")
      } else {
        addNotification("Login successful!", "success")
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      addNotification("Login failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Keep your existing JSX structure */}
      <div className={styles.formHeader}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Email Address</label>
        <div className={styles.inputWrapper}>
          <Mail className={styles.icon} />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={styles.input}
            placeholder="you@example.com"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Password</label>
        <div className={styles.inputWrapper}>
          <Lock className={styles.icon} />
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className={styles.input}
            placeholder="••••••••"
            disabled={isLoading}
            required
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <p className={styles.signupText}>
        Don't have an account?{" "}
        <Link href="/signup" className={styles.signupLink}>
          Create one
        </Link>
      </p>
    </form>
  )
}