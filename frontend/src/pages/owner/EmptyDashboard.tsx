import {
  Plus,
  PlayCircle,
  Store,
  Image as ImageIcon,
  ConciergeBell,
  Clock,
  Rocket,
  ChevronRight,
  BookOpen,
  Video,
  Headphones,
  Gift,
  ShieldCheck,
} from "lucide-react";

import restaurantImage from "../../assets/restaurant.png";
import { Link } from "react-router-dom";

export default function EmptyDashboard() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-slate-900 w-full max-w-[1400px] mx-auto">
      {/* Hero Section */}
      <div className="bg-[#fcfaff] border border-purple-300 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between mb-8 overflow-hidden relative">
        <div className="max-w-xl z-10">
          {/* Custom Badge */}
          <div className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
            Welcome to ZestPartner
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
            You're all set! Let's launch <br />
            your <span className="text-purple-700">first restaurant</span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg mb-8 max-w-md">
            Create your restaurant profile, add menu items, and start receiving
            orders from customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/owner/shop/create" className="flex items-center justify-center gap-2 bg-purple-800 hover:bg-purple-900 text-white font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer">
              <Plus className="w-5 h-5" />
              Get Started
            </Link>

            <svg
              className="absolute right-10 top-10 opacity-20"
              width="400"
              height="400"
              viewBox="0 0 400 400"
              fill="none"
            >
              <path
                d="M200 0C310.457 0 400 89.543 400 200C400 310.457 310.457 400 200 400C89.543 400 0 310.457 0 200"
                stroke="#7C3AED"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
            </svg>
          </div>
        </div>

        {/* Right Side Image */}
        {/* Right Side Image */}
        <div className="mt-8 md:mt-0 w-full md:w-[55%] flex justify-end md:justify-center items-center z-10 relative">
          {/* Subtle background decoration could go here, but using the image as requested */}
          <img
            src={restaurantImage}
            alt="Restaurant Illustration"
            // Increased max-width and added a scale transform for larger screens
            className="w-full max-w-[600px] lg:max-w-[700px] object-contain md:scale-110 lg:scale-125 transform origin-right md:origin-center"
          />
        </div>
      </div>

      {/* Bottom Grid Container */}
      <div className="flex flex-col gap-6">
        {/* Left Column - Setup Steps */}
        <div className="border border-gray-300 rounded-2xl p-6 md:p-8 bg-white">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Let's get you up and running
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Follow these steps to set up your restaurant
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Steps List */}
            <div className="flex-1 flex flex-col">
              {/* Step 1 */}
              <div className="flex items-center py-4 border-b border-gray-300 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mr-4 shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 text-slate-500 text-xs flex items-center justify-center font-medium mr-4 shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Create Restaurant
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add basic information about your restaurant
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>

              {/* Step 2 */}
              <div className="flex items-center py-4 border-b border-gray-300 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mr-4 shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 text-slate-500 text-xs flex items-center justify-center font-medium mr-4 shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Add Restaurant Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload logo, photos and set cuisine type
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>

              {/* Step 3 */}
              <div className="flex items-center py-4 border-b border-gray-300 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mr-4 shrink-0">
                  <ConciergeBell className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 text-slate-500 text-xs flex items-center justify-center font-medium mr-4 shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Add Your First Menu Item
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add delicious items to your menu
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>

              {/* Step 4 */}
              <div className="flex items-center py-4 border-b border-gray-300 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mr-4 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 text-slate-500 text-xs flex items-center justify-center font-medium mr-4 shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Set Opening Hours
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose your restaurant's operating hours
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>

              {/* Step 5 */}
              <div className="flex items-center py-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mr-4 shrink-0">
                  <Rocket className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 text-slate-500 text-xs flex items-center justify-center font-medium mr-4 shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Publish Restaurant
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Make your restaurant live for customers
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </div>

            {/* Progress Box */}
            <div className="w-full md:w-[260px] border border-gray-300 rounded-2xl p-6 flex flex-col items-center shadow-sm">
              <div className="relative w-24 h-24 mb-6">
                {/* Background track circle */}
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-gray-300"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress circle (currently at 0%, but setup for future dynamic values) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-purple-400"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="251.2"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900">0%</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Setup Progress
              </h3>
              <p className="text-xs text-slate-500 mb-8">0 of 5 completed</p>

              <div className="mt-8 w-full rounded-lg bg-[#F8F7FF] p-4 flex gap-3 items-start border border-purple-300">
                <Gift className="h-5 w-5 text-[#5B21B6] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#5B21B6]">
                    Complete all steps
                  </p>
                  <p className="text-xs text-purple-900/70 mt-1">
                    and start receiving orders from customers!
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>

      </div>
    </div>
  );
}
