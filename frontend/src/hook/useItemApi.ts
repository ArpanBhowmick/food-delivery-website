import { useAxiosPrivate } from "@/hook/useAxiosPrivate";
import { useCallback } from "react";

export const useItemApi = () => {
  const axiosPrivate = useAxiosPrivate();

  // add item to a shop
  const addShopItem = async (shopId: string, formData: FormData) => {
    const response = await axiosPrivate.post(`/item/${shopId}`, formData);
    return response.data;
  };

  // edit item
  const editItem = async (shopId: string, itemId: string, formData: FormData,) => {
    const response = await axiosPrivate.put(`/item/${shopId}/${itemId}`, formData);
    return response.data;
  };

  // get all items by shop
  const getItemsByShop =useCallback(async (shopId: string) => {
    const response = await axiosPrivate.get(`/item/${shopId}`);
    return response.data;
  }, [axiosPrivate]) 


  // delete item
  const deleteItem = async (shopId: string, itemId: string) => {
    const response = await axiosPrivate.delete(`/item/${shopId}/${itemId}`);
    return response.data;
  };


  // get all items from shops in a city
  const getItemsByCity = async (city: string) => {
    const response = await axiosPrivate.get("/item/city", {
      params: {
        city,
      },
    });
    return response.data;
  };

  return {
    addShopItem,
    editItem,
    getItemsByShop,
    deleteItem,
    getItemsByCity
  };
};
