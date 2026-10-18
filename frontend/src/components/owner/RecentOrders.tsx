import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import useOrderApi from "@/hook/useOrderApi";

const POLL_INTERVAL_MS = 30_000;

const ORDERS_PER_PAGE = 10;
const ORDERS_PER_BATCH = 50;
const FRONTEND_PAGES_PER_BATCH = ORDERS_PER_BATCH / ORDERS_PER_PAGE;

// Shape of the order data returned by GET /order/shop/:shopId/orders.
interface RecentShopOrderItem {
  name?: string;
  quantity?: number;
}

interface RecentShopOrder {
  _id?: string;
  shop?: { _id?: string; name?: string } | null;
  items?: RecentShopOrderItem[];
  itemTotal?: number;
  orderStatus?: string;
}

interface RecentOrder {
  _id: string;
  user?: { name?: string } | null;
  createdAt?: string;
  shopOrders?: RecentShopOrder[];
}

// A flattened, display-ready row for one shop order.
interface RecentOrderRow {
  key: string;
  orderReference: string;
  customer: string;
  items: string;
  date: string;
  status: string;
  total: number | null;
}

interface RecentOrdersProps {
  shopId: string;
}

// Convert a status value into readable text.
const formatStatus = (status?: string) => {
  if (!status) return "Unknown";
  if (status === "outForDelivery") return "Out for Delivery";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Format an order's creation date safely.
const formatOrderDate = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

// Format items as "2x Item Name", one per line.
const formatItems = (items?: RecentShopOrderItem[]) => {
  if (!items || items.length === 0) return "No items";

  return items
    .map((item) => `${item.quantity ?? 1}x ${item.name ?? "Item"}`)
    .join("\n");
};

const RecentOrders = ({ shopId }: RecentOrdersProps) => {
  const { getShopOrders } = useOrderApi();

  // Backend batches of 50 shop orders, cached per shop and batch number.
  const [batches, setBatches] = useState<
    Record<string, Record<number, RecentOrderRow[]>>
  >({});
  const [totalOrdersByShop, setTotalOrdersByShop] = useState<
    Record<string, number>
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Page number is stored together with the shop it was chosen for, so
  // switching shops starts back at page 1 without an effect.
  const [pageSelection, setPageSelection] = useState({ shopId, page: 1 });

  // Keep the latest getShopOrders available without re-running the fetch effect.
  const getShopOrdersRef = useRef(getShopOrders);

  // Mirror of the batches state so the fetch effect can read the cache
  // without listing batches as a dependency.
  const batchesRef = useRef(batches);

  // One entry per shop + backend batch currently being requested.
  const inFlightRef = useRef(new Set<string>());

  // Set by "Try again" so the retry fetches even if the batch is cached.
  const forceReloadRef = useRef(false);

  useEffect(() => {
    getShopOrdersRef.current = getShopOrders;
  }, [getShopOrders]);

  useEffect(() => {
    batchesRef.current = batches;
  }, [batches]);

  // Total pages always come from the backend count, never from the rows
  // of the currently cached batch.
  const totalOrders = totalOrdersByShop[shopId] ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalOrders / ORDERS_PER_PAGE));

  const requestedPage = pageSelection.shopId === shopId ? pageSelection.page : 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);

  // Frontend pages 1-5 come from backend batch 1, page 6 from batch 2, etc.
  const currentBatch =
    Math.floor((currentPage - 1) / FRONTEND_PAGES_PER_BATCH) + 1;

  const localPage =
    ((currentPage - 1) % FRONTEND_PAGES_PER_BATCH) + 1;

  useEffect(() => {
    let active = true;
    const inFlight = inFlightRef.current;
    const inFlightKey = `${shopId}:${currentBatch}`;
    const forceReload = forceReloadRef.current;
    forceReloadRef.current = false;

    const fetchBatch = async (isPoll: boolean) => {
      if (inFlight.has(inFlightKey)) return;

      const cached =
        batchesRef.current[shopId]?.[currentBatch] !== undefined;

      // Navigate to an already cached batch: render it without a request.
      // Polls and retries always go to the server for the current batch.
      if (!isPoll && !forceReload && cached) return;

      inFlight.add(inFlightKey);

      try {
        const response = await getShopOrdersRef.current(
          shopId,
          currentBatch,
          ORDERS_PER_BATCH,
        );

        if (!active) return;

        const list = Array.isArray(response?.orders)
          ? (response.orders as RecentOrder[])
          : [];

        // One row per shop order, newest first. The backend already scopes
        // the records to this owner and shop; the filter is a safety net.
        const nextRows: RecentOrderRow[] = [];

        for (const order of list) {
          for (const shopOrder of order.shopOrders ?? []) {
            if (shopOrder?.shop?._id !== shopId) continue;

            nextRows.push({
              key: `${order._id}-${shopOrder._id}`,
              orderReference: `#${order._id.slice(-6)}`,
              customer: order.user?.name || "Unknown",
              items: formatItems(shopOrder.items),
              date: formatOrderDate(order.createdAt),
              status: formatStatus(shopOrder.orderStatus),
              total:
                typeof shopOrder.itemTotal === "number"
                  ? shopOrder.itemTotal
                  : null,
            });
          }
        }

        setBatches((prev) => ({
          ...prev,
          [shopId]: { ...prev[shopId], [currentBatch]: nextRows },
        }));

        setTotalOrdersByShop((prev) => ({
          ...prev,
          [shopId]:
            typeof response?.pagination?.totalOrders === "number"
              ? response.pagination.totalOrders
              : (prev[shopId] ?? 0),
        }));

        setError(false);
      } catch (err) {
        console.error("Failed to fetch recent orders:", err);

        if (active) setError(true);
      } finally {
        inFlight.delete(inFlightKey);

        if (active) setLoading(false);
      }
    };

    fetchBatch(false);

    const intervalId = setInterval(() => {
      fetchBatch(true);
    }, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(intervalId);

      // Release the in-flight key so a remounted effect (StrictMode in
      // development) can fetch the same batch instead of waiting for a poll.
      inFlight.delete(inFlightKey);
    };
  }, [shopId, currentBatch, reloadKey]);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    forceReloadRef.current = true;
    setReloadKey((key) => key + 1);
  };

  const changePage = (page: number) => {
    setPageSelection({
      shopId,
      page: Math.min(Math.max(page, 1), totalPages),
    });
  };

  const renderBody = () => {
    const batchRows = batches[shopId]?.[currentBatch];

    if (error) {
      return (
        <div className="px-6 py-8 text-center text-sm text-slate-600">
          <p>We couldn&apos;t load recent orders.</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 cursor-pointer rounded-md bg-[#581c87] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#4c1a78]"
          >
            Try again
          </button>
        </div>
      );
    }

    // An uncached batch means a request is about to run (or is running).
    if (loading || batchRows === undefined) {
      return (
        <div className="px-6 py-8 text-center text-sm text-slate-500">
          Loading recent orders...
        </div>
      );
    }

    if (batchRows.length === 0) {
      return (
        <div className="px-6 py-8 text-center text-sm text-slate-500">
          No orders yet for this shop.
        </div>
      );
    }

    const pageStart = (localPage - 1) * ORDERS_PER_PAGE;
    const visibleRows = batchRows.slice(pageStart, pageStart + ORDERS_PER_PAGE);

    return (
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="border-b-2 border-slate-200">
            <TableHead className="font-bold text-slate-900 w-[100px] pl-6">
              Order #
            </TableHead>
            <TableHead className="font-bold text-slate-900">
              Customer Name
            </TableHead>
            <TableHead className="font-bold text-slate-900">
              Items Ordered
            </TableHead>
            <TableHead className="font-bold text-slate-900">
              Date & Time
            </TableHead>
            <TableHead className="font-bold text-slate-900">
              Status
            </TableHead>
            <TableHead className="font-bold text-slate-900 text-right pr-6">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.map((order) => (
            <TableRow
              key={order.key}
              className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
            >
              <TableCell className="font-medium text-blue-600 pl-6 cursor-pointer hover:underline">
                {order.orderReference}
              </TableCell>
              <TableCell className="text-slate-800">{order.customer}</TableCell>
              <TableCell className="text-slate-800 whitespace-pre-line leading-relaxed">
                {order.items}
              </TableCell>
              <TableCell className="text-slate-800">{order.date}</TableCell>
              <TableCell className="text-slate-800">{order.status}</TableCell>
              <TableCell className="text-right font-medium text-slate-900 pr-6">
                {order.total === null ? "—" : `₹${order.total}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderPagination = () => {
    const batchRows = batches[shopId]?.[currentBatch];

    if (loading || error || batchRows === undefined || totalOrders === 0) {
      return null;
    }

    const paginationButtonClass =
      "cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

    return (
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className={paginationButtonClass}
        >
          Previous
        </button>

        <span className="text-sm text-slate-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={paginationButtonClass}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-base font-bold uppercase tracking-wide">
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {renderBody()}
        {renderPagination()}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
