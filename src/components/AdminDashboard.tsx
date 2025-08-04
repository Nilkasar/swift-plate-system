import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, ChefHat, DollarSign, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  tableNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  orderTime: Date;
  assignedChef?: string;
  total: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    tableNumber: '5',
    items: [
      { name: 'Truffle Risotto', quantity: 2, price: 28 },
      { name: 'Caesar Salad', quantity: 1, price: 16 }
    ],
    status: 'pending',
    orderTime: new Date(Date.now() - 300000),
    total: 72
  },
  {
    id: '2',
    tableNumber: '12',
    items: [
      { name: 'Grilled Salmon', quantity: 1, price: 32 },
      { name: 'Chocolate Soufflé', quantity: 2, price: 14 }
    ],
    status: 'preparing',
    orderTime: new Date(Date.now() - 600000),
    assignedChef: 'Chef Marco',
    total: 60
  },
  {
    id: '3',
    tableNumber: '8',
    items: [
      { name: 'Truffle Risotto', quantity: 1, price: 28 }
    ],
    status: 'ready',
    orderTime: new Date(Date.now() - 900000),
    assignedChef: 'Chef Sarah',
    total: 28
  }
];

const chefs = ['Chef Marco', 'Chef Sarah', 'Chef Antonio', 'Chef Elena'];

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const { toast } = useToast();

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`,
    });
  };

  const assignChef = (orderId: string, chef: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, assignedChef: chef, status: 'preparing' } : order
    ));
    toast({
      title: "Chef Assigned",
      description: `Order assigned to ${chef}`,
    });
  };

  const generateBill = (order: Order) => {
    toast({
      title: "Bill Generated",
      description: `Bill for table ${order.tableNumber} is ready for download`,
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getTotalRevenue = () => {
    return orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.total, 0);
  };

  const getActiveOrders = () => {
    return orders.filter(o => o.status !== 'completed').length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-base to-warm-grey">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-playfair font-bold text-deep-brown mb-2">
            Admin Dashboard
          </h1>
          <p className="text-warm-grey">Manage orders and restaurant operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-slide-up">
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warm-grey">Active Orders</p>
                  <p className="text-2xl font-bold text-deep-brown">{getActiveOrders()}</p>
                </div>
                <Users className="w-8 h-8 text-wine-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warm-grey">Avg. Prep Time</p>
                  <p className="text-2xl font-bold text-deep-brown">18m</p>
                </div>
                <Clock className="w-8 h-8 text-wine-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warm-grey">Active Chefs</p>
                  <p className="text-2xl font-bold text-deep-brown">{chefs.length}</p>
                </div>
                <ChefHat className="w-8 h-8 text-wine-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warm-grey">Today's Revenue</p>
                  <p className="text-2xl font-bold text-deep-brown">${getTotalRevenue()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-wine-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management */}
        <Tabs defaultValue="all" className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
          </TabsList>

          {(['all', 'pending', 'preparing', 'ready'] as const).map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {orders
                .filter(order => tab === 'all' || order.status === tab)
                .map(order => (
                  <Card key={order.id} className="card-premium">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-playfair text-deep-brown">
                          Table {order.tableNumber}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-warm-grey">
                            {order.orderTime.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-medium text-deep-brown mb-2">Items:</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.quantity}x {item.name}</span>
                                <span className="text-wine-primary font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-warm-grey mt-2 pt-2 flex justify-between font-bold">
                            <span className="text-deep-brown">Total:</span>
                            <span className="text-wine-primary">${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          {order.status === 'pending' && (
                            <Select onValueChange={(chef) => assignChef(order.id, chef)}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Assign Chef" />
                              </SelectTrigger>
                              <SelectContent>
                                {chefs.map(chef => (
                                  <SelectItem key={chef} value={chef}>{chef}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {order.assignedChef && (
                            <Badge variant="outline" className="border-gold-accent text-deep-brown">
                              {order.assignedChef}
                            </Badge>
                          )}

                          {order.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="btn-gold"
                            >
                              Mark Ready
                            </Button>
                          )}

                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="btn-wine"
                            >
                              Complete Order
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateBill(order)}
                            className="btn-elegant"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Bill
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateBill(order)}
                            className="btn-elegant"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;