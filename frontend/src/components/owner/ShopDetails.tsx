import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Star,
  Eye,
  Pencil,
  Trash2,
  Settings,
  Plus,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import RecentOrders from "./RecentOrders";
import { MenuOverview } from "./MenuOverview";
import { AddFirstItem } from "./AddFirstItem";
import { ShopGeneralInfo } from "./ShopInfo";
import { useItemApi } from "@/hook/useItemApi";
import { useShopApi } from "@/hook/useShopApi";
import { clearItems, setItems } from "@/store/ItemSlice";
import { deactivateShop, removeShop } from "@/store/shopSlice";
import ItemCard from "./ItemCard";

export default function ShopDetails() {
  const [loadingItems, setLoadingItems] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { getItemsByShop } = useItemApi();
  const { deleteShop } = useShopApi();

  const { shopId } = useParams();

  const shop = useSelector((state: RootState) =>
    state.shop.shops.find((shop) => shop._id === shopId),
  );

  const items = useSelector((state: RootState) => state.item.items);

  useEffect(() => {
    const fetchItems = async () => {
      if (!shopId) return;

      try {
        const response = await getItemsByShop(shopId);

        dispatch(setItems(response.items));
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingItems(false);
      }
    };

    if (items.length === 0) {
      fetchItems();
    } else {
      setLoadingItems(false);
    }
  }, [shopId, items.length, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearItems());
    };
  }, [dispatch]);

  if (loadingItems) {
    return <div>Loading...</div>;
  }

  if (!shop) {
    return <div>Shop not found</div>;
  }

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await deleteShop(shop._id);

      setDeleteMessage(response.message);

      if (response.action === "deactivated") {
        setDeleteMessage(response.message);
        dispatch(deactivateShop(shop._id));
        setDeleteDialogOpen(false);

        return;
      }

      setDeleteDialogOpen(false);
      dispatch(removeShop(shop._id));
      navigate("/owner");
    } catch (error) {
      // Keep the dialog open so the owner can read the reason and retry.
      setDeleteError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to delete shop")
          : "Failed to delete shop",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      {/* Top Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2 text-slate-600 font-semibold rounded-md border-slate-300"
          >
            <Link to="/owner">
              <ArrowLeft className="w-4 h-4" />
              BACK TO ALL SHOPS
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            Welcome to - {shop.name}
          </h1>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Dynamic date: <span className="text-slate-800">October 26, 2023</span>
        </div>
      </div>

      {/* Delete Result Message */}
      {deleteMessage && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {deleteMessage}
        </div>
      )}

      {/* Hero Image Section */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-6 shadow-sm">
        {/* Placeholder for the pizza oven image */}
        <img
          src={shop.image.url || "/placeholder-shop.jpg"}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl font-bold">{shop.name}</h2>
              <Badge
                className={
                  shop.isActive === false
                    ? "bg-slate-200 text-slate-600 hover:bg-slate-200 border-none font-semibold px-2 py-0.5"
                    : "bg-green-200 text-green-800 hover:bg-green-200 border-none font-semibold px-2 py-0.5"
                }
              >
                {shop.isActive === false ? "Inactive" : "Active"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <span className="flex items-center gap-1 text-white">
                4.8 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </span>
              <span>|</span>
              <span>$24.5k Revenue</span>
              <span>|</span>
              <span>1,120 Orders</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <Eye className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => {
                setDeleteError(null);
                setDeleteDialogOpen(true);
              }}
              aria-label={`Delete ${shop.name}`}
              className="bg-red-100 hover:bg-red-200 text-red-600 cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Middle Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {items.length === 0 ? (
          <AddFirstItem shopId={shop._id} />
        ) : (
          <MenuOverview />
        )}

        <ShopGeneralInfo shop={shop} />
      </div>

      {/* Show only if there are items */}
      {items.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Menu Items</h2>
            <Button
              asChild
              className="bg-[#581c87] hover:bg-[#4c1775] cursor-pointer"
            >
              <Link to={`/owner/shop/${shop._id}/item/add`}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-5 mb-8">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} shopId={shop._id} />
            ))}
          </div>
        </>
      )}

      <RecentOrders shopId={shop._id} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          // The dialog can only be closed while no request is running.
          if (isDeleting) return;

          setDeleteDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this shop?</DialogTitle>
            <DialogDescription>
              Are you sure you want to continue? If the shop has no order or
              delivery history, it and its menu items will be permanently
              deleted. If resolved history exists, the shop will be deactivated
              to preserve its history. Shops with unresolved orders or delivery
              assignments cannot be removed.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
            >
              {deleteError}
            </p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
