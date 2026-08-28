"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import signupImage from "../assets/signup-image.png";
import signupImage from "../../assets/signup-image.png"
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "@/schema/auth.schema";
import axios from "axios";
import { api } from "@/api/axios";
import { setCredentials } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import type { AuthResponse } from "@/types/auth.types";
import { roleHome } from "@/utils/roleRoutes";




export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "user" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Form Data:", data);
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);

      console.log("registration response", response.data);
      console.log("Registration successful:", response.data.message);
      
      dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken
        })
      )

      navigate(roleHome[
        response.data.user.role 
      ])

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        console.log(error.response?.data.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900 flex-col md:flex-row">
      {/* LEFT PANEL - ILLUSTRATION */}

      <div className="flex w-full flex-col px-6 py-4 sm:px-8 sm:py-6 md:w-3/5 md:py-8 lg:w-1/2 lg:px-16 lg:py-2 xl:px-32">
        {/* Back Button */}
        {/* <button className="flex w-fit items-center text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Login
        </button> */}

        {/* Form Container */}
        <div className="mx-auto mt-2 sm:mt-4 md:mt-6 lg:mt-6 w-full max-w-md flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-1">
            Join Us, New Adventurer
          </h1>
          <p className="mb-4 sm:mb-6 text-sm text-slate-500">
            Hey, we're excited to help you get started!
          </p>

          <form
            className="space-y-2 sm:space-y-3 lg:space-y-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                className="border-slate-300"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Row 2: Email + mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
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
              <div className="space-y-1.5">
                <Label htmlFor="mobile">mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="XXXXX XXXXX"
                  className="border-slate-300"
                  {...register("mobile")}
                />
                {errors.mobile && (
                  <p className="text-xs text-red-500">
                    {errors.mobile.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Password + Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
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
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="border-slate-300 pr-10"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5 pt-0 sm:pt-1 lg:pt-2">
              <Label>Role Selection</Label>
              <div className="flex w-full items-center rounded-md border border-slate-300 p-1">
                {(["user", "owner", "deliveryBoy"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() =>
                      setValue("role", r, { shouldValidate: true })
                    }
                    className={`flex-1 rounded-sm py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                      selectedRole === r
                        ? "bg-[#7032f9]/80 text-slate-200"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button className="mt-2 sm:mt-4 w-full bg-[#7032f9] py-4 sm:py-5 lg:py-6 text-base font-semibold hover:bg-[#5b27ce] cursor-pointer">
              Sign Up
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

            {/* Google Sign Up */}
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

          {/* Sign In Link */}
          <div className="mt-2 sm:mt-3 lg:mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-[#7032f9] hover:underline cursor-pointer"
            >
              Sign In
            </Link>
          </div>

          {/* Terms & Conditions */}
          {/* <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-center space-x-2">
            <Checkbox id="terms" className="border-slate-300 data-[state=checked]:bg-[#7032f9] data-[state=checked]:border-[#7032f9]" />
            <label
              htmlFor="terms"
              className="text-xs text-slate-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              By signing up, you agree to our{" "}
              <a href="#" className="text-[#7032f9] hover:underline">
                Terms & Conditions
              </a>
              .
            </label>
          </div> */}
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}

      <div className="relative hidden w-full md:w-2/5 md:flex lg:w-1/2 min-h-screen bg-white overflow-hidden">
        <div className="flex items-center justify-center w-full h-full p-6 sm:p-7 lg:p-2">
          <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden">
            <img
              src={signupImage}
              alt="Sign Up Illustration"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
