"use client";

import { useState } from "react";
import { z } from "zod";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValue,
  FieldValues,
  useForm,
  UseFormStateReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setLoading(true);
    console.log(values);
    // simulate API
    await new Promise((res) => setTimeout(res, 2000));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900  px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl grid md:grid-cols-2 gap-8"
      >
        {/* Left - Marketing Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col justify-center space-y-6 text-center md:text-left"
        >
          <h1 className="text-4xl font-bold leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              TurfBuddies
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Book your turf, join tournaments, and track live scores — all in one
            app. Sign in to access your dashboard and exclusive perks.
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li>🏆 Join local tournaments & win exciting prizes</li>
            <li>⚡ Quick turf booking with instant confirmation</li>
            <li>📊 Track live match stats and schedules</li>
          </ul>
        </motion.div>

        {/* Right - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="glass-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="w-5 h-5 text-primary" />
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({
                      field,
                      fieldState,
                      formState,
                    }: {
                      field: ControllerRenderProps<LoginFormData, "email">;
                      fieldState: ControllerFieldState;
                      formState: UseFormStateReturn<LoginFormData>;
                    }) => (
                      <FormItem>
                        <Label>Email</Label>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            type="email"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({
                      field,
                      fieldState,
                      formState,
                    }: {
                      field: ControllerRenderProps<LoginFormData, "password">;
                      fieldState: ControllerFieldState;
                      formState: UseFormStateReturn<LoginFormData>;
                    }) => (
                      <FormItem>
                        <Label>Password</Label>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            type="password"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full glow-button"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Sign In
                  </Button>
                </form>
              </Form>

              <Separator className="my-6" />

              <p className="text-sm text-center text-muted-foreground">
                Don’t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
