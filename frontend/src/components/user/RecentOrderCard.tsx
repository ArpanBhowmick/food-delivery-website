import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Receipt, Store, RotateCcw, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { RootState } from "@/store/store"
import useOrderApi from "@/hook/useOrderApi"

const MAX_RECENT_ORDERS = 5

interface RecentOrderItem {
  name?: string
  image?: string
  quantity?: number
  item?: { name?: string; image?: string } | null
}

interface RecentShopOrder {
  shop?: { name?: string } | null
  items?: RecentOrderItem[]
}

interface BackendRecentOrder {
  _id: string
  createdAt: string
  orderStatus: string
  pricing?: { totalAmount?: number } | null
  shopOrders?: RecentShopOrder[]
}

export interface RecentOrder {
  id: string
  restaurant: string
  status: string
  date: string
  items: string
  total: number
  imageUrl: string
}

interface UserRecentOrdersProps {
  onToast?: (message: string) => void
  onSelectReceipt?: (order: RecentOrder) => void
  onReorder?: (order: RecentOrder) => void
}

const getOrderImage = (order: BackendRecentOrder): string => {
  for (const shopOrder of order.shopOrders ?? []) {
    for (const item of shopOrder.items ?? []) {
      const image = item.image || item.item?.image
      if (image) return image
    }
  }
  return ''
}

const getRestaurantName = (order: BackendRecentOrder): string => {
  const names = (order.shopOrders ?? [])
    .map((shopOrder) => shopOrder.shop?.name)
    .filter((name): name is string => Boolean(name))

  if (names.length === 0) return 'Restaurant'
  if (names.length === 1) return names[0]

  return `${names[0]} +${names.length - 1} more`
}

const getOrderSummary = (order: BackendRecentOrder): string => {
  const items = (order.shopOrders ?? []).flatMap((shopOrder) => shopOrder.items ?? [])

  if (items.length === 0) return 'Order items unavailable'

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0)

  const firstItemName = items[0].name || items[0].item?.name || 'Item'

  if (items.length === 1) {
    return `${totalQuantity} item${totalQuantity === 1 ? '' : 's'}: ${firstItemName}`
  }

  return `${totalQuantity} item${totalQuantity === 1 ? '' : 's'}: ${firstItemName} + ${items.length - 1} more`
}

const formatOrderDate = (value: string): string => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const mapOrderStatus = (status: string): string => {
  if (!status) return 'Processing'
  const normalized = status.toLowerCase()
  if (normalized.includes('deliver')) return 'Delivered'
  if (normalized.includes('cancel')) return 'Cancelled'
  if (normalized.includes('prepar')) return 'Preparing'
  if (normalized.includes('out')) return 'Out for Delivery'
  if (normalized.includes('confirm') || normalized.includes('place')) return 'Confirmed'
  return status
}

const mapBackendOrder = (order: BackendRecentOrder): RecentOrder => {
  return {
    id: order._id,
    restaurant: getRestaurantName(order),
    status: mapOrderStatus(order.orderStatus),
    date: formatOrderDate(order.createdAt),
    items: getOrderSummary(order),
    total: order.pricing?.totalAmount ?? 0,
    imageUrl: getOrderImage(order),
  }
}

export default function RecentOrderCard({
  onToast = () => {},
  onSelectReceipt = () => {},
  onReorder = () => {},
}: UserRecentOrdersProps) {
  const user = useSelector((state: RootState) => state.auth.user)
  const { getOrders } = useOrderApi()

  const [orders, setOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState<boolean>(Boolean(user))
  const [error, setError] = useState(false)
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const getOrdersRef = useRef(getOrders)

  useEffect(() => {
    getOrdersRef.current = getOrders
  }, [getOrders])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      setOrders([])
      setLoadedUserId(null)
      setError(false)
      return
    }

    let active = true

    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(false)
        const response = await getOrdersRef.current()

        if (!active) return

        const list = Array.isArray(response?.orders)
          ? (response.orders as BackendRecentOrder[])
          : []

        const sorted = [...list].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )

        const mapped = sorted.slice(0, MAX_RECENT_ORDERS).map(mapBackendOrder)
        setOrders(mapped)
        setLoadedUserId(user.id)
        setError(false)
      } catch (err) {
        console.error('Failed to fetch recent orders:', err)
        if (active) setError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchOrders()

    return () => {
      active = false
    }
  }, [user, reloadKey])

  const handleRetry = () => {
    setError(false)
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  const isRecentOrdersEmpty = !!user && !loading && !error && loadedUserId === user.id && orders.length === 0

  return (
    <section
      id="recent-orders-section"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-10 mb-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-[#6d28d9]" />
          <h2 className="text-xl font-bold">Recent Orders</h2>
        </div>
        {user && !loading && !error && orders.length > 0 && (
          <a
            href="#my-orders"
            onClick={(e) => {
              e.preventDefault()
              onToast('Displaying completed orders')
            }}
            className="flex cursor-pointer items-center gap-1 rounded-full bg-purple-100/50 px-4 py-1.5 text-sm font-medium text-[#7e22ce] transition hover:bg-purple-100"
          >
            View all <ChevronRight size={16} />
          </a>
        )}
      </div>

      {!user ? (
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm border border-purple-100">
          <p className="text-sm text-gray-500">Sign in to see your recent orders.</p>
        </div>
      ) : loading || loadedUserId !== user.id ? (
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm border border-purple-100">
          <p className="text-sm text-gray-500">Loading recent orders...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm border border-red-100">
          <p className="text-sm text-gray-600">We couldn't load your recent orders.</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 cursor-pointer rounded-full bg-[#7e22ce] px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
          >
            Try again
          </button>
        </div>
      ) : isRecentOrdersEmpty ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 text-center shadow-sm border border-purple-100">
          <div className="max-w-md mx-auto space-y-3 py-4">
            <div className="w-16 h-16 rounded-full bg-[#f3f0ff] flex items-center justify-center mx-auto text-[#6d28d9]">
              <Receipt className="w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-extrabold text-[#0f172a]">
              No previous orders yet
            </h3>
            <p className="text-[13px] text-slate-600">
              Once you complete orders, your meal history and receipts will be stored here for
              fast 1-click reordering.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById('restaurants-section')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold text-[13px] shadow-sm transition-all cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>Explore Restaurants</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Carousel className="w-full" aria-label="Recent orders">
          <CarouselContent className="py-2 -ml-2">
            {orders.map((order) => (
              <CarouselItem
                key={order.id}
                className="pl-2 basis-[88%] sm:basis-[58%] md:basis-[46%] lg:basis-[34%] xl:basis-[calc(100%/4.5)] 2xl:basis-[calc(100%/4.5)]"
              >
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-purple-100 hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f3f0ff] text-[#6d28d9] text-[11px] font-bold">
                        {order.status}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 overflow-hidden shrink-0 border border-purple-100">
                        {order.imageUrl ? (
                          <img
                            src={order.imageUrl}
                            alt={order.restaurant}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#6d28d9]">
                            <Store className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[15px] font-bold text-[#0f172a] truncate">
                          {order.restaurant}
                        </h4>
                        <p className="text-[12px] text-slate-500 truncate">{order.items}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-purple-100/70 mt-4 flex items-center justify-between">
                    <span className="text-[16px] font-extrabold text-[#0f172a]">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectReceipt(order)}
                        className="px-3 py-1.5 rounded-xl bg-[#f3f0ff] hover:bg-[#ede9fe] text-[#6d28d9] font-bold text-[12px] transition-colors cursor-pointer"
                      >
                        Receipt
                      </button>
                      <button
                        type="button"
                        onClick={() => onReorder(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#ede9fe] hover:bg-[#ddd6fe] text-[#5b21b6] font-bold text-[12px] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="inset-y-auto left-2 top-1/2 my-0 z-10 -translate-y-1/2 border-white/80 bg-white/90 text-gray-700 shadow-md backdrop-blur hover:bg-white disabled:hidden" />
          <CarouselNext className="inset-y-auto right-2 top-1/2 my-0 z-10 -translate-y-1/2 border-white/80 bg-white/90 text-gray-700 shadow-md backdrop-blur hover:bg-white disabled:hidden" />
        </Carousel>
      )}
    </section>
  )
}
