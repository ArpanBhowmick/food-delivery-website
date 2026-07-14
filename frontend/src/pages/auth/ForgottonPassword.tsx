import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-12 shadow-2xl">
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-2">
          Forgot Password
        </h1>
        <p className="text-center text-gray-600 mb-8 text-base">
          Enter the email address associated with your account, and we'll email
          you a password reset link.
        </p>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              className="rounded-xl border-gray-300 h-12"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#7032f9] hover:bg-violet-700 text-white font-semibold"
          >
            Send Reset Link
          </Button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          Remembered your password?{" "}
          <Link
            to="/signin"
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
