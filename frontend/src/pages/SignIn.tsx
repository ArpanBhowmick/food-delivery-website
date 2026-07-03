"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import signinImage from "../assets/signin-image.png";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
      
      {/* LEFT PANEL - ILLUSTRATION (Hidden on small screens) */}
      
      {/* <div className="relative hidden w-1/2 flex-col items-center justify-center bg-[#7032f9] overflow-hidden lg:flex">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 text-center p-8">
          <p className="text-xl font-bold mb-4">Illustration Area</p>
          <p className="text-sm">
            Replace this div with your custom image asset: <br />
            <code>&lt;img src="/path-to-login-illustration.png" className="w-full h-full object-cover" /&gt;</code>
          </p>
        </div>
      </div> */}

      {/* RIGHT PANEL - FORM */}
      <div className="flex w-full flex-col justify-center px-8 py-10 lg:w-1/2 lg:px-16 xl:px-32">
        
        {/* Form Container */}
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="mb-8 text-sm text-slate-500">
            Please enter your details to sign in.
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" className="border-slate-300" />
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-[#7032f9] data-[state=checked]:border-[#7032f9]" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none text-slate-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-semibold text-[#7032f9] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button className="mt-6 w-full bg-[#7032f9] py-6 text-base font-semibold hover:bg-[#5b27ce]">
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <a href="#" className="font-semibold text-[#7032f9] hover:underline">
              Sign Up
            </a>
          </div>
          
        </div>
      </div>

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