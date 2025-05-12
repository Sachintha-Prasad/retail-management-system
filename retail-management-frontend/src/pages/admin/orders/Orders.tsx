import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@nextui-org/react';
import { orders } from '../../../data/orders';

export function Orders() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <Card>
        <CardBody>
          <Table aria-label="Orders">
            <TableHeader>
              <TableColumn>Order ID</TableColumn>
              <TableColumn>Customer ID</TableColumn>
              <TableColumn>Total</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Date</TableColumn>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerId}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip color={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>
                      {order.status}
                    </Chip>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
