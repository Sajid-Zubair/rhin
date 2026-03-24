"use client"

import { useState } from "react"
import { RoleSelector } from "@/frontend/components/rhin/role-selector"
import { LanguagePicker } from "@/frontend/components/rhin/language-picker"
import { OTPLogin } from "@/frontend/components/rhin/otp-login"
import { AshaLogin } from "@/frontend/components/rhin/asha-login"
import { VillagerApp } from "@/frontend/components/rhin/villager/villager-app"
import { AshaApp } from "@/frontend/components/rhin/asha/asha-app"
import { AdminApp } from "@/frontend/components/rhin/admin/admin-app"
import { DeliveryApp } from "@/frontend/components/rhin/delivery/delivery-app"

export type UserRole = "villager" | "asha" | "admin" | "delivery" | null
export type Language = "te" | "hi" | "en" | null
export type AuthState = "role-select" | "language-pick" | "login" | "authenticated"

export default function RHINApp() {
  const [role, setRole] = useState<UserRole>(null)
  const [language, setLanguage] = useState<Language>(null)
  const [authState, setAuthState] = useState<AuthState>("role-select")
  const [isOnline, setIsOnline] = useState(true)

  // Handle role selection
  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setAuthState("language-pick")
  }

  // Handle language selection
  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage)
    setAuthState("login")
  }

  // Handle successful login
  const handleLoginSuccess = () => {
    setAuthState("authenticated")
  }

  // Handle logout - return to role selection
  const handleLogout = () => {
    setRole(null)
    setLanguage(null)
    setAuthState("role-select")
  }

  // Render based on auth state
  if (authState === "role-select") {
    return <RoleSelector onRoleSelect={handleRoleSelect} />
  }

  if (authState === "language-pick") {
    return (
      <LanguagePicker 
        onLanguageSelect={handleLanguageSelect} 
        onBack={() => setAuthState("role-select")}
      />
    )
  }

  if (authState === "login") {
    // Different login flows based on role
    if (role === "villager" || role === "delivery") {
      return (
        <OTPLogin 
          role={role}
          language={language}
          onSuccess={handleLoginSuccess}
          onBack={() => setAuthState("language-pick")}
        />
      )
    }
    if (role === "asha") {
      return (
        <AshaLogin 
          language={language}
          onSuccess={handleLoginSuccess}
          onBack={() => setAuthState("language-pick")}
        />
      )
    }
    if (role === "admin") {
      // Admin goes directly to authenticated (would have proper auth in production)
      return (
        <OTPLogin 
          role={role}
          language={language}
          onSuccess={handleLoginSuccess}
          onBack={() => setAuthState("language-pick")}
        />
      )
    }
  }

  // Authenticated - show the appropriate app
  if (authState === "authenticated") {
    switch (role) {
      case "villager":
        return (
          <VillagerApp 
            language={language} 
            isOnline={isOnline}
            onOnlineChange={setIsOnline}
            onLogout={handleLogout}
          />
        )
      case "asha":
        return (
          <AshaApp 
            language={language}
            isOnline={isOnline}
            onOnlineChange={setIsOnline}
            onLogout={handleLogout}
          />
        )
      case "admin":
        return (
          <AdminApp 
            language={language}
            onLogout={handleLogout}
          />
        )
      case "delivery":
        return (
          <DeliveryApp 
            language={language}
            isOnline={isOnline}
            onOnlineChange={setIsOnline}
            onLogout={handleLogout}
          />
        )
      default:
        return <RoleSelector onRoleSelect={handleRoleSelect} />
    }
  }

  return <RoleSelector onRoleSelect={handleRoleSelect} />
}
