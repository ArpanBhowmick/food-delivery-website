import {
  ArrowLeft,
  UtensilsCrossed,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  createItemSchema,
  ITEM_CATEGORIES,
  type CreateItemForm,
} from "@/schema/itemSchema";
import { useItemApi } from "@/hook/useItemApi";
import prePreview from "../../assets/pre-preview2.png";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setItems, updateItem } from "@/store/ItemSlice";
import type { IItem } from "@/types/item.types";

const EditItem = () => {
  const navigate = useNavigate();

  const { shopId, itemId } = useParams();

  const { editItem, getItemsByShop } = useItemApi();

  const [previewUrl, setPreviewUrl] = useState(prePreview);

  const dispatch = useDispatch<AppDispatch>();

  const item = useSelector((state: RootState) =>
    state.item.items.find((item) => item._id === itemId),
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateItemForm>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      foodType: "veg",
      isAvailable: true,
    },
  });

  useEffect(() => {
    const loadItem = async () => {
      if (!shopId || !itemId) return;

      try {
        // Item already exists in Redux
        if (item) {
          reset({
            name: item.name,
            description: item.description,
            category: item.category,
            price: item.price,
            foodType: item.foodType,
            isAvailable: item.isAvailable,
          });

          setPreviewUrl(item.image?.url || prePreview);

          return;
        }

        // Item is not in Redux, so fetch all items of this shop
        const response = await getItemsByShop(shopId);

        dispatch(setItems(response.items));

        // Find the item we are editing
        const itemToEdit = response.items.find(
          (item: IItem) => item._id === itemId,
        );

        if (!itemToEdit) return;

        reset({
          name: itemToEdit.name,
          description: itemToEdit.description,
          category: itemToEdit.category,
          price: itemToEdit.price,
          foodType: itemToEdit.foodType,
          isAvailable: itemToEdit.isAvailable,
        });

        setPreviewUrl(itemToEdit.image?.url || prePreview);
      } catch (error) {
        console.log(error);
      }
    };

    loadItem();
  }, [item, itemId, shopId, getItemsByShop, dispatch, reset]);

  const name = watch("name");
  const description = watch("description");
  const category = watch("category");
  const price = watch("price");
  const foodType = watch("foodType");
  const isAvailable = watch("isAvailable");
  const image = watch("image");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store the selected image in react-hook-form state
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setValue("image", file, {
      shouldValidate: true,
    });
  };

  // Generate a temporary preview URL whenever the selected image changes
  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  // Create the item and navigate back to the shop page on success
  const onSubmit = async (data: CreateItemForm) => {
    if (!shopId || !itemId) return;

    try {
   
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value == null) return;

       
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await editItem(shopId, itemId, formData);

      dispatch(updateItem(response.item));

      reset();
      setPreviewUrl(prePreview);
      navigate(`/owner/shop/${shopId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.status);
        console.log(error.response?.data?.message);
      }
    }
  };

  // Reset the form and return to the shop dashboard
  const handleCancel = () => {
    reset();
    setPreviewUrl(prePreview);
    navigate(`/owner/shop/${shopId}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          to={`/owner/shop/${shopId}`}
          className="flex items-center text-[#581c87] text-sm font-semibold mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-purple-100 p-3 rounded-xl text-[#581c87]">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {" "}
              Edit Menu Item
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Edit the details of your menu item
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
                  Item Information
                </h2>
                <p className="text-slate-500 text-sm">
                  Fill in the details of your menu item.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <p className="text-slate-500 text-xs mb-2">
                    Enter the name of the dish as you want customers to see it.
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Margherita Pizza"
                      {...register("name")}
                      className="w-full rounded-lg border border-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] focus:border-transparent placeholder:text-slate-400"
                    />
                    <span className="absolute right-3 top-3 text-xs text-slate-400">
                      {name?.length || 0}/50
                    </span>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category and Price */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <p className="text-slate-500 text-xs mb-2">
                      Select the category for this item.
                    </p>
                    <select
                      {...register("category")}
                      className="w-full rounded-lg border border-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] text-slate-500 appearance-none bg-white"
                    >
                      <option value="">Select category</option>
                      {ITEM_CATEGORIES.map((itemCategory) => (
                        <option key={itemCategory} value={itemCategory}>
                          {itemCategory}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <p className="text-slate-500 text-xs mb-2">
                      Set the price for this item.
                    </p>
                    <input
                      type="number"
                      min={1}
                      step="0.01"
                      placeholder="e.g. 149"
                      {...register("price", { valueAsNumber: true })}
                      className="w-full rounded-lg border border-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] focus:border-transparent placeholder:text-slate-400"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Food Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Food Type <span className="text-red-500">*</span>
                  </label>
                  <p className="text-slate-500 text-xs mb-2">
                    Is this item veg or non-veg?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { value: "veg", label: "Veg" },
                        { value: "non-veg", label: "Non-Veg" },
                      ] as const
                    ).map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setValue("foodType", type.value)}
                        className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                          foodType === type.value
                            ? type.value === "veg"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-red-500 bg-red-50 text-red-700"
                            : "border-slate-400 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center ${
                            type.value === "veg"
                              ? "border-green-600"
                              : "border-red-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              type.value === "veg"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          />
                        </span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {errors.foodType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.foodType.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <p className="text-slate-500 text-xs mb-2">
                    Describe the item so customers know what they are ordering.
                  </p>
                  <div className="relative">
                    <textarea
                      {...register("description")}
                      placeholder="e.g. Wood-fired pizza topped with fresh mozzarella and basil"
                      rows={4}
                      className="w-full rounded-lg border border-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581c87] focus:border-transparent placeholder:text-slate-400 resize-none"
                    ></textarea>
                    <span className="absolute right-3 bottom-3 text-xs text-slate-400">
                      {description?.length || 0}/500
                    </span>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Availability
                    </p>
                    <p className="text-xs text-slate-500">
                      {isAvailable
                        ? "This item is available for orders"
                        : "This item is hidden from customers"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue("isAvailable", !isAvailable)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      isAvailable ? "bg-green-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        isAvailable ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Item Image */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Item Image
                  </label>
                  <p className="text-slate-500 text-xs mb-3">
                    Upload a photo of this item.
                  </p>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="col-span-1 space-y-6">
            {/* Item Preview Card */}
            <div className="bg-white rounded-xl border border-slate-400 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                Item Preview
              </h2>
              <p className="text-slate-500 text-xs mb-4">
                This is how your item will appear to customers.
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Image Area */}
                <div className="bg-[#f5f3ff] relative flex items-center justify-center aspect-video rounded-t-xl overflow-hidden">
                  <img
                    src={previewUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Preview Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                            foodType === "non-veg"
                              ? "border-red-600"
                              : "border-green-600"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              foodType === "non-veg"
                                ? "bg-red-600"
                                : "bg-green-600"
                            }`}
                          />
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 truncate">
                          {name || "Item Name"}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">
                        {category || "Category"}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 shrink-0">
                      ₹{price || "0"}
                    </span>
                  </div>

                  {description && (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    {category && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 text-[#581c87] text-xs font-medium border border-purple-200">
                        {category}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        isAvailable
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isAvailable ? "bg-green-600" : "bg-red-500"
                        }`}
                      ></div>
                      {isAvailable ? "Available" : "Not Available"}
                    </span>
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

export default EditItem;
