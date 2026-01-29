import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { useToast } from "@/context/ToastContext"
import { supabase } from "@/lib/supabase"

export const useSettings = () => {
    const { currentUser, logout } = useAuth()
    const {
        darkMode,
        toggleDarkMode,
        fontSize,
        setFontSize,
        dataSaver,
        setDataSaver,
    } = useTheme()
    const { addToast } = useToast()

    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    })
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        try {
            await logout()
            addToast("Logged out successfully")
        } catch (error) {
            console.error("Logout error:", error)
            addToast("Failed to logout")
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            addToast("Passwords do not match", "error")
            return
        }
        if (passwordData.newPassword.length < 6) {
            addToast("Password must be at least 6 characters", "error")
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword,
            })
            if (error) throw error
            addToast("Password updated successfully!")
            setIsChangingPassword(false)
            setPasswordData({ newPassword: "", confirmPassword: "" })
        } catch (err: any) {
            console.error("Password update error:", err)
            addToast(err.message || "Failed to update password", "error")
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordReset = async () => {
        if (!currentUser?.email) return
        setLoading(true)
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                currentUser.email,
                {
                    redirectTo: `${window.location.origin}/settings?type=recovery`,
                }
            )
            if (error) throw error
            addToast("Password reset email sent!")
        } catch (err: any) {
            console.error("Reset password error:", err)
            addToast(err.message || "Failed to send reset email", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleClearCache = () => {
        // In a real app, this would clear temporary stored data, not necessarily session
        const keysToRemove = ["seenStories", "font-size", "data-saver", "theme"]
        keysToRemove.forEach((key) => localStorage.removeItem(key))
        addToast("Cache cleared! Reloading...")
        setTimeout(() => window.location.reload(), 1500)
    }

    const handleDownloadData = async () => {
        if (!currentUser) return
        setLoading(true)
        try {
            // Mock data fetching for export
            const data = {
                user: {
                    id: currentUser.id,
                    handle: currentUser.handle,
                    name: currentUser.name,
                    email: currentUser.email,
                },
                exportDate: new Date().toISOString(),
                note: "This is a mock export of your Sysm data.",
            }

            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
            })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `sysm-data-${currentUser.handle}.json`
            link.click()
            URL.revokeObjectURL(url)
            addToast("Data export started!")
        } catch {
            addToast("Failed to export data", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = () => {
        const confirmed = window.confirm(
            "Are you absolutely sure? This will permanently delete your account and all associated data. This action is irreversible."
        )
        if (confirmed) {
            addToast("Account deletion request submitted. Logging out...")
            setTimeout(handleLogout, 2000)
        }
    }

    const handleReportBug = () => {
        const bug = window.prompt("Please describe the bug you found:")
        if (bug) {
            addToast("Bug reported! Thank you for your feedback.")
        }
    }

    return {
        currentUser,
        darkMode,
        toggleDarkMode,
        fontSize,
        setFontSize,
        dataSaver,
        setDataSaver,
        isChangingPassword,
        setIsChangingPassword,
        passwordData,
        setPasswordData,
        loading,
        handleLogout,
        handlePasswordChange,
        handlePasswordReset,
        handleClearCache,
        handleDownloadData,
        handleDeleteAccount,
        handleReportBug,
    }
}
