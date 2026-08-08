import { useAxiosPrivate } from "@/hook/useAxiosPrivate";

export const useShopApi = () => {
  const axiosPrivate = useAxiosPrivate();

  // create shop
  const createShop = async (formData: FormData) => {
    const response = await axiosPrivate.post("/shop", formData);
    return response.data;
  };

  // edit shop
  const editShop = async (shopId: string, formData: FormData) => {
    const response = await axiosPrivate.put(`/shop/${shopId}`, formData);
    return response.data;
  };


  // get all owner shops
  const getOwnerShops = async () => {
    const response = await axiosPrivate.get("/shop");
    return response.data;
  }


  // get shop by id
  const getShopById = async (shopId: string) => {
    const response  = await axiosPrivate.get(`/shop/${shopId}`)
    return response.data;
  }


  

  return {
    createShop,
    editShop,
    getOwnerShops,
    getShopById,
  };
};
