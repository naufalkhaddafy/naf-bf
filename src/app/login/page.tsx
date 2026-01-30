"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Mail, Lock, Eye, EyeOff, KeyRound, AlertCircle } from "lucide-react"
import { Turnstile } from "@marsidev/react-turnstile"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { loginAction } from "@/actions/auth"

// Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, { message: "Email wajib diisi" }).email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password wajib diisi" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [token, setToken] = useState<string>("")

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Shake animation for error
  const [shake, setShake] = useState(false)

  const onLogin = async (data: LoginFormValues) => {
    if (!token) {
        setError("Selesaikan verifikasi anti-bot dulu ya!")
        setShake(true)
        setTimeout(() => setShake(false), 500)
        return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("token", token)

    const result = await loginAction(null, formData)
    
    // Note: loginAction handles redirect on success, so if we are here it failed or we wait for redirect
    if (result && !result.success) {
      setError(result.message)
      setLoading(false)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-gray-50 to-white p-4 relative overflow-hidden">
      
      {/* Background Ambience - Light & Fresh */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-[128px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-200/40 rounded-full blur-[128px] animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, x: shake ? [-10, 10, -10, 10, 0] : 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-xl bg-white/80 border-white/50 shadow-2xl text-gray-900 overflow-hidden ring-1 ring-black/5">
            {/* Glossy Header Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-500 opacity-90"></div>
            
            <CardHeader className="space-y-1 text-center pb-8 pt-10">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto w-16 h-16 bg-gradient-to-br from-white to-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-lg shadow-emerald-500/10 mb-6 group"
                >
                    <KeyRound className="w-8 h-8 text-emerald-600 group-hover:rotate-12 transition-transform duration-500" />
                </motion.div>
                <CardTitle className="text-3xl font-serif font-bold tracking-wide text-emerald-950">
                    Admin Access
                </CardTitle>
                <CardDescription className="text-gray-500 text-sm font-medium">
                    Masuk ke Dashboard NAF Aviary
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onLogin)} className="space-y-5">
                    
                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3 text-red-600 text-sm mb-4 font-medium"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <Label className="text-gray-600 text-xs uppercase tracking-wider font-bold ml-1">Email Address</Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-600" />
                            <Input 
                                {...form.register("email")}
                                className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 h-12 text-base shadow-sm" 
                                placeholder="nama@nafbirdfarm.com"
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-red-500 text-xs ml-1 font-medium">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                         <Label className="text-gray-600 text-xs uppercase tracking-wider font-bold ml-1">Password</Label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-600" />
                            <Input 
                                {...form.register("password")}
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 h-12 text-base shadow-sm" 
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none p-1"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                         {form.formState.errors.password && (
                            <p className="text-red-500 text-xs ml-1 font-medium">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    
                    {/* Cloudflare Turnstile */}
                    <div className="flex justify-center py-2">
                        <Turnstile 
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} 
                            onSuccess={(token) => setToken(token)}
                            options={{
                                theme: 'light',
                                size: 'normal',
                            }}
                        />
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold h-12 text-base shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-300 mt-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            "Masuk Dashboard"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center pb-8 pt-4">
                <p className="text-xs text-gray-500 font-medium">
                    &copy; 2026 NAF Aviary System
                </p>
            </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
