"use client";

import { useState } from "react";
import { ChevronLeft, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import signupImage from "../assets/signup-image.png";

export default function SignUpPage() {
  const [role, setRole] = useState<"User" | "Owner" | "Delivery Boy">("User");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900 flex-col md:flex-row">
      {/* LEFT PANEL - ILLUSTRATION */}
      {/* <div className="relative hidden w-full md:w-2/5 md:flex lg:w-1/2 min-h-screen bg-[#7032f9] overflow-hidden">
        <img
          src={signupImage}
          alt="Sign Up Illustration"
          className="w-full h-full object-cover absolute inset-0"
        />
      </div> */}

      

      {/* RIGHT PANEL - FORM */}
      <div className="flex w-full flex-col px-6 py-4 sm:px-8 sm:py-6 md:w-3/5 md:py-8 lg:w-1/2 lg:px-16 lg:py-6 xl:px-32">
        {/* Back Button */}
        <button className="flex w-fit items-center text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Login
        </button>

        {/* Form Container */}
        <div className="mx-auto mt-2 sm:mt-4 md:mt-6 lg:mt-8 w-full max-w-md flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-1">
            Join Us, New Adventurer
          </h1>
          <p className="mb-4 sm:mb-6 text-sm text-slate-500">
            Hey, we're excited to help you get started!
          </p>

          <form
            className="space-y-2 sm:space-y-3 lg:space-y-3"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Row 1: First Name + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="border-slate-300"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="border-slate-300"
                />
              </div>
            </div>

            {/* Row 2: Email (full width) */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                className="border-slate-300"
              />
            </div>

            {/* Row 3: Phone (full width) */}
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="XXXXX XXXXX"
                className="border-slate-300"
              />
            </div>

            {/* Row 4: Password + Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="border-slate-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="border-slate-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5 pt-0 sm:pt-1 lg:pt-2">
              <Label>Role Selection</Label>
              <div className="flex w-full items-center rounded-md border border-slate-300 p-1">
                {(["User", "Owner", "Delivery Boy"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-sm py-1.5 text-sm font-medium transition-colors ${
                      role === r
                        ? "bg-slate-200 text-slate-900"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button className="mt-2 sm:mt-4 w-full bg-[#7032f9] py-4 sm:py-5 lg:py-6 text-base font-semibold hover:bg-[#5b27ce]">
              Sign Up
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-2 sm:mt-3 lg:mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a
              href="#"
              className="font-semibold text-[#7032f9] hover:underline"
            >
              Sign In
            </a>
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
