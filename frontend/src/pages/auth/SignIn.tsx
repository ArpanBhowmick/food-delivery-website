"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// import signinImage from "../assets/signin-image.png";
import signinImage from "../../assets/signin-image.png";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "@/schema/auth.schema";
import { api } from "@/api/axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import axios from "axios";
import type { AppDispatch } from "@/store/store";
import { roleHome } from "@/utils/roleRoutes";
import type { AuthResponse } from "@/types/auth.types";
import { setLocation } from "@/store/locationSlice";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      console.log("Login successful:", response.data);

      dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
        }),
      );

      if (response.data.user.defaultAddress) {
        dispatch(setLocation(response.data.user.defaultAddress));
      }

      navigate(roleHome[response.data.user.role]);
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        console.log(error.response?.data.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
      {/* LEFT PANEL - ILLUSTRATION (Hidden on small screens) */}

      <div className="flex w-full flex-col justify-center px-8 py-8 lg:w-1/2 lg:px-16 xl:px-32">
        {/* Form Container */}
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="mb-8 text-sm text-slate-500">
            Please enter your details to sign in.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                className="border-slate-300"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="border-slate-300 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <EyeOff className="h-4 w-4" />
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-slate-300 data-[state=checked]:bg-[#7032f9] data-[state=checked]:border-[#7032f9] cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none text-slate-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-[#7032f9] hover:underline cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button className="mt-4 w-full bg-[#7032f9] py-6 text-base font-semibold hover:bg-[#5b27ce] cursor-pointer">
              Sign In
            </Button>

            {/* OR Divider */}
            <div className="relative my-4 sm:my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-400" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">OR</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-md border border-slate-400 py-3 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#7032f9] hover:underline cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}

      <div className="relative hidden w-full md:w-2/5 md:flex lg:w-1/2 min-h-screen bg-white overflow-hidden">
        <div className="flex items-center justify-center w-full h-full p-6 sm:p-7 lg:p-2">
          <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden">
            <img
              src={signinImage}
              alt="Sign In Illustration"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
