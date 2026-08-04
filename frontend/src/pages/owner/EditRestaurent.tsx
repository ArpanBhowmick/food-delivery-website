import React from 'react';
import { 
  ArrowLeft, 
  Store, 
  UploadCloud, 
  MapPin, 
  Building2,
  CheckCircle2,
  Image as ImageIcon,
  Info,
  Save,
  Utensils,
  Clock,
  Settings
} from 'lucide-react';

const EditRestaurant = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <button className="flex items-center text-[#581c87] text-sm font-semibold mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-purple-100 p-3 rounded-xl text-[#581c87]">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Restaurant</h1>
            <p className="text-slate-500 text-sm mt-1">Update your restaurant's basic information and settings</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Form */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
                  <p className="text-slate-500 text-sm">Update your restaurant's core details.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                  Live Profile
                </span>
              </div>

              <div className="space-y-6">
                {/* Restaurant Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Restaurant Name <span className="text-red-500">*</span>
                  </label>
                  <p className="text-slate-500 text-xs mb-2">Update your restaurant name as you want customers to see it.</p>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue="Zest Signature Kitchen"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] focus:border-transparent placeholder:text-slate-400"
                    />
                    <span className="absolute right-3 top-3 text-xs text-slate-400">22/100</span>
                  </div>
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <p className="text-slate-500 text-xs mb-2">Update your restaurant city.</p>
                    <select 
                      defaultValue="san-francisco"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] text-slate-700 appearance-none bg-white">
                      <option value="san-francisco">San Francisco</option>
                      <option value="new-york">New York</option>
                      <option value="chicago">Chicago</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <p className="text-slate-500 text-xs mb-2">Update your restaurant state.</p>
                    <select 
                      defaultValue="ca"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] text-slate-700 appearance-none bg-white">
                      <option value="ca">California</option>
                      <option value="ny">New York</option>
                      <option value="il">Illinois</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <p className="text-slate-500 text-xs mb-2">Update your complete restaurant address.</p>
                  <div className="relative">
                    <textarea 
                      defaultValue="1284 Culinary Avenue, Downtown District"
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] focus:border-transparent placeholder:text-slate-400 resize-none"
                    ></textarea>
                    <span className="absolute right-3 bottom-3 text-xs text-slate-400">38/300</span>
                  </div>
                </div>

                {/* Restaurant Image */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Restaurant Cover Image
                  </label>
                  <p className="text-slate-500 text-xs mb-3">Update the logo or image for your restaurant.</p>
                  
                  {/* Active Image State */}
                  <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#f5f3ff] rounded-lg border border-purple-100 flex items-center justify-center">
                        <Store className="w-8 h-8 text-[#581c87]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">zest_kitchen_cover.jpg</p>
                        <p className="text-xs text-slate-500 mt-0.5">1.2 MB • Uploaded 2 months ago</p>
                      </div>
                    </div>
                    <button className="text-sm text-[#581c87] font-semibold hover:underline px-3 py-1.5 bg-purple-50 rounded-lg">
                      Replace
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
                <button className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors">
                  Discard Changes
                </button>
                <button className="px-6 py-2.5 rounded-lg bg-[#581c87] text-white font-medium text-sm hover:bg-[#4c1775] transition-colors flex items-center shadow-sm shadow-purple-900/20">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="col-span-1 space-y-6">
            
            {/* Settings Navigation */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <nav className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-purple-50 text-[#581c87] rounded-lg font-medium text-sm">
                  <Store className="w-4 h-4" />
                  Basic Info
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors">
                  <Utensils className="w-4 h-4 text-slate-400" />
                  Cuisine & Contact
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Business Hours
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Advanced Settings
                </a>
              </nav>
            </div>

            {/* Restaurant Preview Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1">Live Preview</h2>
              <p className="text-slate-500 text-xs mb-4">This is how your current profile appears.</p>
              
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                {/* Banner Area */}
                <div className="h-28 bg-[#581c87] relative flex items-center justify-center">
                  {/* Profile Image Overlay */}
                  <div className="absolute -bottom-8 w-16 h-16 bg-white rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                    <Store className="w-7 h-7 text-[#581c87]" />
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="pt-10 pb-4 px-4 text-center">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Zest Signature Kitchen</h3>
                  
                  <div className="space-y-3 text-left bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-start gap-3 text-slate-600 text-xs">
                      <MapPin className="w-4 h-4 text-[#581c87] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">1284 Culinary Avenue, Downtown District</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-xs">
                      <Building2 className="w-4 h-4 text-[#581c87] shrink-0" />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Tips Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Editing Tips</h2>
              
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="mt-0.5 bg-blue-50 p-1.5 rounded-lg text-blue-600 h-fit">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Changes reflect instantly</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Once you save, updates will be immediately visible on your live menu.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 bg-green-50 p-1.5 rounded-lg text-green-600 h-fit">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Keep location accurate</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Ensure address changes match your actual physical storefront for delivery routing.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurant;