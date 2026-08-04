import {
  ArrowLeft,
  Store,
  UploadCloud,
  MapPin,
  Building2,
  CheckCircle2,
  Image as ImageIcon,
  Info,
} from "lucide-react";
import prePreview from "../../assets/pre-preview2.png";
import { useForm } from "react-hook-form";
import {
  createRestaurantSchema,
  type CreateRestaurantForm,
} from "@/schema/restaurantSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { states, cities } from "@/data/locations";
import TipsCard from "@/components/owner/TipsCard";
import { useShopApi } from "@/hook/useShopApi";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CreateRestaurant = () => {

  const navigate = useNavigate();

  const { createShop } = useShopApi();


  const [previewUrl, setPreviewUrl] = useState(prePreview);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateRestaurantForm>({
    resolver: zodResolver(createRestaurantSchema),
  });

  // Watch form fields for live preview
  const name = watch("name");
  const city = watch("city");
  const state = watch("state");
  const address = watch("address");
  const image = watch("image");

  // console.log(image);

  // Reference to the hidden file input
  // Used to open the file picker programmatically
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle restaurant image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setValue("image", file, {
      shouldValidate: true,
    });
  };

  // Update image preview whenever
  // the selected image changes
  useEffect(() => {
    if (!image) {
      setPreviewUrl(prePreview);
      return;
    }

    const objectUrl = URL.createObjectURL(image);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  // Reset city whenever the state changes
  useEffect(() => {
    setValue("city", "");
  }, [state, setValue]);

  // TODO:
  // This works because the form currently contains only strings and File.
  // If nested objects or arrays are added later, update the FormData conversion logic.
  // Handle form submission

  const onSubmit = async (data: CreateRestaurantForm) => {

    try {
      
 const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    await createShop(formData);

    reset();
    setPreviewUrl(prePreview);
     navigate("/owner");

    } catch (error) {
       if (axios.isAxiosError(error)) {
    console.log(error.response?.status);
    console.log(error.response?.data.message);
  }
    }
   
  };

  const handleCancel = () => {
    reset();
    setPreviewUrl(prePreview);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link to="/owner" className="flex items-center text-[#581c87] text-sm font-semibold mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-purple-100 p-3 rounded-xl text-[#581c87]">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Create Your Restaurant
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Add your restaurant details to get started with receiving orders
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-400 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Basic Information
                </h2>
                <p className="text-slate-500 text-sm">
                  Let's start with your restaurant's basic details.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Restaurant Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Restaurant Name <span className="text-red-500">*</span>
                  </label>
                  <p className="text-slate-500 text-xs mb-2">
                    Enter your restaurant name as you want customers to see it.
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter restaurant name"
                      {...register("name")}
                      className="w-full rounded-lg border border-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] focus:border-transparent placeholder:text-slate-400"
                    />
                    <span className="absolute right-3 top-3 text-xs text-slate-400">
                      {name?.length || 0}/20
                    </span>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <p className="text-slate-500 text-xs mb-2">
                      Select your restaurant state.
                    </p>
                    <select
                      {...register("state")}
                      className="w-full rounded-lg border border-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] text-slate-500 appearance-none bg-white"
                    >
                      <option value="">Select state</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <p className="text-slate-500 text-xs mb-2">
                      Select your restaurant city.
                    </p>
                    <select
                      {...register("city")}
                      className="w-full rounded-lg border border-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] text-slate-500 appearance-none bg-white"
                    >
                      <option value="">Select city</option>
                      {state &&
                        cities[state as keyof typeof cities].map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <p className="text-slate-500 text-xs mb-2">
                    Enter your complete restaurant address.
                  </p>
                  <div className="relative">
                    <textarea
                      {...register("address")}
                      placeholder="Enter complete address"
                      rows={4}
                      className="w-full rounded-lg border border-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] focus:border-transparent placeholder:text-slate-400 resize-none"
                    ></textarea>
                    <span className="absolute right-3 bottom-3 text-xs text-slate-400">
                      {address?.length || 0}/300
                    </span>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Restaurant Image */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Restaurant Image
                  </label>
                  <p className="text-slate-500 text-xs mb-3">
                    Upload a logo or image for your restaurant.
                  </p>

                  {/* Hidden input */}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {/* Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-400 bg-purple-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 transition-colors"
                  >
                    {image ? (
                      <>
                        <ImageIcon className="w-8 h-8 text-green-600 mb-3" />

                        <p className="text-sm font-semibold text-slate-700">
                          {image.name}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          Click to change image
                        </p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-[#581c87] mb-3" />
                        <p className="text-sm text-slate-600 mb-1">
                          Drag & drop your image here, or{" "}
                          <span className="text-[#581c87] font-semibold">
                            click to browse
                          </span>
                        </p>
                        <p className="text-xs text-slate-500">
                          PNG, JPG, JPEG up to 5MB
                        </p>
                      </>
                    )}
                  </div>

                  {errors.image && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.image.message}
                    </p>
                  )}
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200">
                  <button
                    className="px-6 py-2.5 rounded-lg border border-slate-400 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2.5 rounded-lg bg-[#581c87] text-white font-medium text-sm hover:bg-[#4c1775] transition-colors flex items-center cursor-pointer">
                    Create Restaurant
                    {/* <ArrowLeft className="w-4 h-4 ml-2 rotate-180" /> */}
                  </button>
                </div>
              </form>

              {/* Form Actions */}
              {/* <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200">
                <button className="px-6 py-2.5 rounded-lg border border-slate-400 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button className="px-6 py-2.5 rounded-lg bg-[#581c87] text-white font-medium text-sm hover:bg-[#4c1775] transition-colors flex items-center">
                  Next: Cuisine & Contact
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </button>
              </div> */}
            </div>
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="col-span-1 space-y-6">
            {/* Stepper Card */}

            {/* Restaurant Preview Card */}
            <div className="bg-white rounded-xl border border-slate-400 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                Restaurant Preview
              </h2>
              <p className="text-slate-500 text-xs mb-4">
                This is how your restaurant profile will appear.
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Banner Area */}
                <div className=" bg-[#f5f3ff] relative flex items-center justify-center aspect-video rounded-t-xl overflow-hidden">
                  <img
                    src={previewUrl}
                    alt=""
                    className="w-full h-full object-cover "
                  />

                  {/* Profile Image Overlay */}
                  {/* <div className="absolute -bottom-8 w-16 h-16 bg-slate-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  </div> */}
                </div>

                {/* Preview Content */}
                <div className="pt-1 pb-4 px-4 text-center">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {name || "Restaurant Name"}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#581c87] text-xs font-medium mb-5 border border-purple-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#581c87]"></div>
                    Not Published
                  </div>

                  <div className="space-y-2 text-left">
                    <div className="flex items-start gap-3 text-slate-500 text-xs">
                      <MapPin className="w-4 h-4 text-[#581c87] shrink-0 mt-0.5" />

                      <span className="max-w-45 break-words">
                        {address || "Restaurant Address"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-xs">
                      <Building2 className="w-4 h-4 text-[#581c87]" />
                      <span>
                        {city && state ? `${city}, ${state}` : "City, State"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TipsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurant;

// this component is re rendering with every key strock in teh form inputs
