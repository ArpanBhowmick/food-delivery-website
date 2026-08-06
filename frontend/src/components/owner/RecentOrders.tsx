import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const RecentOrders = () => {

    const recentOrders = [
    {
      id: "#10123",
      customer: "Emily J.",
      items: "2x Margherita",
      date: "Oct 26, 7:15 PM",
      status: "Completed",
      total: "$38.50",
    },
    {
      id: "#10124",
      customer: "Mike D.",
      items: "1x Lasagna\n1x Gelato",
      date: "Oct 26, 7:10 PM",
      status: "Completed",
      total: "$29.00",
    },
    {
      id: "#10125",
      customer: "Sarah K.",
      items: "1x Risotto",
      date: "Oct 26, 7:05 PM",
      status: "In Progress",
      total: "$21.50",
    },
    {
      id: "#10126",
      customer: "David L.",
      items: "3x Ravioli",
      date: "Oct 26, 6:55 PM",
      status: "Completed",
      total: "$55.00",
    },
  ];
  return (
    <>
    {/* Recent Orders Section */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-base font-bold uppercase tracking-wide">
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
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
                  {recentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    >
                      <TableCell className="font-medium text-blue-600 pl-6 cursor-pointer hover:underline">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-slate-800">
                        {order.customer}
                      </TableCell>
                      <TableCell className="text-slate-800 whitespace-pre-line leading-relaxed">
                        {order.items}
                      </TableCell>
                      <TableCell className="text-slate-800">{order.date}</TableCell>
                      <TableCell className="text-slate-800">
                        {order.status}
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900 pr-6">
                        {order.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
    </>
  )
}

export default RecentOrders