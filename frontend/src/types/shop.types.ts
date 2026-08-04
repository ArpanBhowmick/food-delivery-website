
export interface IShop {
  _id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  image: {
    url: string;
    publicId: string;
  };
  owner: string;
  
  createdAt: string;
  updatedAt: string;
}