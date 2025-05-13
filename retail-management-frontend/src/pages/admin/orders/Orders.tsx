// src/pages/admin/Orders.tsx
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Chip,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../../data/orders";

const statusColors: Record<string, "default" | "warning" | "success"> = {
  pending: "warning",
  shipped: "default",
  delivered: "success",
};

const statusOptions = ["pending", "shipped", "delivered"] as const;

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ success: boolean; message: string }>({
    success: true,
    message: "",
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setModalContent({ success: false, message: "Failed to fetch orders" });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? updated : order))
      );
      setModalContent({ success: true, message: "Order status updated." });
      setModalOpen(true);
    } catch (error) {
      setModalContent({ success: false, message: "Failed to update status." });
      setModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order._id !== id));
      setModalContent({ success: true, message: "Order deleted successfully!" });
      setModalOpen(true);
    } catch (error) {
      setModalContent({ success: false, message: "Failed to delete order." });
      setModalOpen(true);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <Card>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner label="Loading orders..." />
            </div>
          ) : (
            <Table isStriped aria-label="Orders Table" shadow="none">
              <TableHeader>
                <TableColumn>Order ID</TableColumn>
                <TableColumn>Customer</TableColumn>
                <TableColumn>Total</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No orders found.">
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.customerId?.name || "N/A"}</TableCell>
                    <TableCell>${order.total?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell className="flex flex-row gap-2">
                      <Select
                        className="w-32"
                        aria-label="Update Status"
                        placeholder="Upadate Status"
                        selectedKeys={[order.status]}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </Select>
                      <Chip color={statusColors[order.status] || "default"} className="mt-2">
                        {order.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="danger"
                        size="sm"
                        variant="light"
                        onClick={() => handleDelete(order._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader
                className={modalContent.success ? "text-success" : "text-danger"}
              >
                {modalContent.success ? "Success" : "Error"}
              </ModalHeader>
              <ModalBody>
                <p>{modalContent.message}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color={modalContent.success ? "success" : "danger"}
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
