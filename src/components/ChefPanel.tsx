import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Users, ChefHat, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChefOrder {
  id: string;
  tableNumber: string;
  items: Array<{ name: string; quantity: number; notes?: string }>;
  orderTime: Date;
  priority: 'normal' | 'high' | 'urgent';
  status: 'assigned' | 'accepted' | 'preparing' | 'completed' | 'rejected';
  estimatedTime?: number;
}

const mockOrders: ChefOrder[] = [
  {
    id: '1',
    tableNumber: '5',
    items: [
      { name: 'Truffle Risotto', quantity: 2, notes: 'Extra truffle please' },
      { name: 'Caesar Salad', quantity: 1 }
    ],
    orderTime: new Date(Date.now() - 300000),
    priority: 'normal',
    status: 'assigned',
    estimatedTime: 25
  },
  {
    id: '2',
    tableNumber: '12',
    items: [
      { name: 'Grilled Salmon', quantity: 1, notes: 'Medium rare' },
      { name: 'Chocolate Soufflé', quantity: 2 }
    ],
    orderTime: new Date(Date.now() - 600000),
    priority: 'high',
    status: 'preparing',
    estimatedTime: 20
  },
  {
    id: '3',
    tableNumber: '8',
    items: [
      { name: 'Truffle Risotto', quantity: 1 }
    ],
    orderTime: new Date(Date.now() - 900000),
    priority: 'urgent',
    status: 'accepted',
    estimatedTime: 15
  }
];

const ChefPanel = () => {
  const [orders, setOrders] = useState<ChefOrder[]>(mockOrders);
  const [selectedTab, setSelectedTab] = useState('assigned');
  const { toast } = useToast();

  const updateOrderStatus = (orderId: string, newStatus: ChefOrder['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    const statusMessages = {
      accepted: 'Order accepted and queued for preparation',
      rejected: 'Order rejected - will be reassigned',
      preparing: 'Order preparation started',
      completed: 'Order completed and ready for service'
    };

    toast({
      title: "Order Updated",
      description: statusMessages[newStatus as keyof typeof statusMessages],
    });
  };

  const getPriorityColor = (priority: ChefOrder['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusColor = (status: ChefOrder['status']) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'preparing': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getOrdersByStatus = (status: string) => {
    if (status === 'assigned') return orders.filter(o => o.status === 'assigned');
    if (status === 'active') return orders.filter(o => ['accepted', 'preparing'].includes(o.status));
    if (status === 'completed') return orders.filter(o => o.status === 'completed');
    return [];
  };

  const getActiveOrdersCount = () => {
    return orders.filter(o => ['accepted', 'preparing'].includes(o.status)).length;
  };

  const getCompletedTodayCount = () => {
    return orders.filter(o => o.status === 'completed').length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-base to-warm-grey">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-deep-brown flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-wine-primary" />
              Chef Panel
            </h1>
            <p className="text-warm-grey">Manage your assigned orders</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-warm-grey">Chef Marco</p>
            <p className="text-2xl font-bold text-deep-brown">{getActiveOrdersCount()} Active Orders</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-slide-up">
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warm-grey">New Orders</p>
                  <p className="text-2xl font-bold text-deep-brown">
                    {orders.filter(o => o.status === 'assigned').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-wine-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warm-grey">In Progress</p>
                  <p className="text-2xl font-bold text-deep-brown">{getActiveOrdersCount()}</p>
                </div>
                <Play className="w-8 h-8 text-wine-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warm-grey">Completed Today</p>
                  <p className="text-2xl font-bold text-deep-brown">{getCompletedTodayCount()}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-wine-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assigned">
              New Orders ({orders.filter(o => o.status === 'assigned').length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({getActiveOrdersCount()})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({getCompletedTodayCount()})
            </TabsTrigger>
          </TabsList>

          {(['assigned', 'active', 'completed'] as const).map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {getOrdersByStatus(tab).length === 0 ? (
                <Card className="card-premium">
                  <CardContent className="p-8 text-center">
                    <p className="text-warm-grey">No orders in this category</p>
                  </CardContent>
                </Card>
              ) : (
                getOrdersByStatus(tab).map(order => (
                  <Card key={order.id} className="card-premium">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-playfair text-deep-brown flex items-center gap-2">
                          <Users className="w-5 h-5 text-wine-primary" />
                          Table {order.tableNumber}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getPriorityColor(order.priority)} text-white`}>
                            {order.priority.toUpperCase()}
                          </Badge>
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
                          <h4 className="font-medium text-deep-brown mb-3">Items to Prepare:</h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="bg-warm-grey/30 p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-medium text-deep-brown">
                                      {item.quantity}x {item.name}
                                    </span>
                                    {item.notes && (
                                      <p className="text-sm text-wine-primary mt-1 italic">
                                        Note: {item.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Estimated Time */}
                        {order.estimatedTime && (
                          <div className="flex items-center gap-2 text-sm text-warm-grey">
                            <Clock className="w-4 h-4" />
                            Estimated time: {order.estimatedTime} minutes
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {order.status === 'assigned' && (
                            <>
                              <Button
                                onClick={() => updateOrderStatus(order.id, 'accepted')}
                                className="btn-wine"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accept Order
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => updateOrderStatus(order.id, 'rejected')}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}

                          {order.status === 'accepted' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="btn-gold"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Preparing
                            </Button>
                          )}

                          {order.status === 'preparing' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="btn-wine"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ChefPanel;