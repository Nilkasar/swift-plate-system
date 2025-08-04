import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, ChefHat, DollarSign, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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
    
    const statusEmojis = {
      pending: '⏳',
      preparing: '👨‍🍳',
      ready: '✅',
      completed: '🎉'
    };
    
    toast({
      title: `${statusEmojis[newStatus]} Status Updated`,
      description: `Order is now ${newStatus}`,
      className: "animate-status-update",
    });
  };

  const assignChef = (orderId: string, chef: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, assignedChef: chef, status: 'preparing' } : order
    ));
    toast({
      title: "👨‍🍳 Chef Assigned",
      description: `Order assigned to ${chef}`,
      className: "animate-order-accepted",
    });
  };

  const generateBill = (order: Order) => {
    const pdf = new jsPDF();
    
    // Add header
    pdf.setFontSize(20);
    pdf.text('Cosmic Bistro', 20, 20);
    pdf.setFontSize(12);
    pdf.text('Premium Dining Experience', 20, 30);
    pdf.text(`Bill for Table ${order.tableNumber}`, 20, 40);
    pdf.text(`Order Time: ${order.orderTime.toLocaleString()}`, 20, 50);
    pdf.text(`Order ID: ${order.id}`, 20, 60);
    
    // Add items
    let yPosition = 80;
    pdf.setFontSize(14);
    pdf.text('Items:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    order.items.forEach((item) => {
      pdf.text(`${item.quantity}x ${item.name}`, 20, yPosition);
      pdf.text(`$${(item.price * item.quantity).toFixed(2)}`, 150, yPosition);
      yPosition += 10;
    });
    
    // Add total
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.text(`Total: $${order.total.toFixed(2)}`, 20, yPosition);
    
    // Add footer
    yPosition += 20;
    pdf.setFontSize(8);
    pdf.text('Thank you for dining with us!', 20, yPosition);
    
    // Download PDF
    pdf.save(`bill-table-${order.tableNumber}-${order.id}.pdf`);
    
    toast({
      title: "✨ Bill Downloaded",
      description: `PDF bill for table ${order.tableNumber} has been generated`,
      className: "animate-order-accepted",
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-golden-glow to-warm-orange text-cosmic-dark';
      case 'preparing': return 'bg-gradient-to-r from-electric-blue to-cyber-green text-cosmic-dark';
      case 'ready': return 'bg-gradient-to-r from-cyber-green to-electric-blue text-cosmic-dark';
      case 'completed': return 'bg-gradient-to-r from-neon-purple to-neon-pink text-cosmic-light';
      default: return 'bg-cosmic-accent text-cosmic-light';
    }
  };

  const getTotalRevenue = () => {
    return orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.total, 0);
  };

  const getActiveOrders = () => {
    return orders.filter(o => o.status !== 'completed').length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-dark via-cosmic-accent to-cosmic-dark">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-playfair font-bold text-cosmic-light mb-2 bg-gradient-to-r from-golden-glow to-warm-orange bg-clip-text text-transparent">
            Admin Command Center
          </h1>
          <p className="text-cosmic-light/70">Control the dining experience</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-slide-up">
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cosmic-light/70">Active Orders</p>
                  <p className="text-2xl font-bold text-cosmic-light">{getActiveOrders()}</p>
                </div>
                <Users className="w-8 h-8 text-neon-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cosmic-light/70">Avg. Prep Time</p>
                  <p className="text-2xl font-bold text-cosmic-light">18m</p>
                </div>
                <Clock className="w-8 h-8 text-electric-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cosmic-light/70">Active Chefs</p>
                  <p className="text-2xl font-bold text-cosmic-light">{chefs.length}</p>
                </div>
                <ChefHat className="w-8 h-8 text-cyber-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cosmic-light/70">Today's Revenue</p>
                  <p className="text-2xl font-bold text-cosmic-light">${getTotalRevenue()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-golden-glow" />
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
                        <CardTitle className="text-lg font-playfair text-cosmic-light">
                          Table {order.tableNumber}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(order.status)} font-semibold animate-pulse-glow`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-cosmic-light/70">
                            {order.orderTime.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-medium text-cosmic-light mb-2">Items:</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-cosmic-light/80">{item.quantity}x {item.name}</span>
                                <span className="text-neon-purple font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-cosmic-accent mt-2 pt-2 flex justify-between font-bold">
                            <span className="text-cosmic-light">Total:</span>
                            <span className="text-golden-glow">${order.total.toFixed(2)}</span>
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
                            <Badge variant="outline" className="border-golden-glow text-golden-glow animate-pulse-glow">
                              {order.assignedChef}
                            </Badge>
                          )}

                          {order.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="btn-cyber animate-status-update"
                            >
                              Mark Ready
                            </Button>
                          )}

                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="btn-neon animate-status-update"
                            >
                              Complete Order
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateBill(order)}
                            className="btn-elegant hover:animate-order-accepted"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Bill
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateBill(order)}
                            className="btn-golden hover:animate-order-accepted"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download PDF
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