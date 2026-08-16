import { ChevronRight } from 'lucide-react'
import useHorizontalOverflow from "@/hook/useHorizontalOverflow";

const RecentOrderCard = () => {
  const { ref, hasOverflow } = useHorizontalOverflow<HTMLDivElement>();

  return (
    <>
    
    {/* Recent Orders Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              {hasOverflow && (
              <button className="text-sm font-medium text-[#7e22ce] bg-purple-100/50 px-4 py-1.5 rounded-full flex items-center gap-1 hover:bg-purple-100 transition cursor-pointer">
                View all <ChevronRight size={16} />
              </button>
              )}
            </div>
            <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                {
                  title: "Perfect Slice of Pepperoni Pizza",
                  price: "$5.59",
                  img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400",
                },
                {
                  title: "Fresh Japanese Style Ramen",
                  price: "$6.89",
                  img: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400",
                },
                {
                  title: "Classic Fried Rice Bowl",
                  price: "$5.59",
                  img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400",
                },
              ].map((order, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden h-40 hover:shadow-md transition cursor-pointer min-w-[260px] snap-start sm:min-w-0"
                >
                  <div className="z-10 w-2/3">
                    <div className="bg-white/80 backdrop-blur-sm px-2 py-1 text-[10px] text-gray-500 rounded-md w-fit mb-2">
                      4.87 km • 21 min
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm mb-2">
                      {order.title}
                    </h3>
                    <p className="text-[#7e22ce] font-bold">{order.price}</p>
                  </div>
                  <img
                    src={order.img}
                    alt={order.title}
                    className="absolute -right-6 -bottom-6 w-32 h-32 object-cover rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>
    
    </>
  )
}

export default RecentOrderCard