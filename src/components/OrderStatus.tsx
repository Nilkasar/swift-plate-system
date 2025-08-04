import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ChefHat, Utensils, ArrowLeft } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderStatusProps {
  tableNumber: string;
  order: OrderItem[];
  onBackToMenu: () => void;
}

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

const statusConfig = {
  pending: { label: 'Order Received', icon: Clock, color: 'bg-yellow-500' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-blue-500' },
  ready: { label: 'Ready', icon: Utensils, color: 'bg-green-500' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-green-600' }
};

const OrderStatus = ({ tableNumber, order, onBackToMenu }: OrderStatusProps) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending');
  const [orderTime] = useState(new Date());

  // Simulate order progress
  useEffect(() => {
    const progressOrder = () => {
      setTimeout(() => setCurrentStatus('preparing'), 3000);
      setTimeout(() => setCurrentStatus('ready'), 8000);
    };
    progressOrder();
  }, []);

  const getStatusIndex = (status: OrderStatus) => {
    const statuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed'];
    return statuses.indexOf(status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  const getTotalPrice = () => {
    return order.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-base to-warm-grey">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <Button variant="outline" onClick={onBackToMenu} className="btn-elegant">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-deep-brown">Order Status</h1>
            <p className="text-warm-grey">Table {tableNumber} • {orderTime.toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Status Timeline */}
        <Card className="card-premium mb-6 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl font-playfair text-deep-brown">Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-warm-grey">
                <div 
                  className="h-full bg-gold-accent transition-all duration-1000"
                  style={{ width: `${(currentIndex / 3) * 100}%` }}
                />
              </div>

              {Object.entries(statusConfig).map(([status, config], index) => {
                const Icon = config.icon;
                const isActive = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div key={status} className="flex flex-col items-center relative z-10">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                      ${isActive ? config.color : 'bg-warm-grey'}
                      ${isCurrent ? 'scale-110 shadow-[var(--shadow-gold)]' : ''}
                    `}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className={`
                      mt-2 text-sm font-medium text-center
                      ${isActive ? 'text-deep-brown' : 'text-warm-grey'}
                    `}>
                      {config.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="card-gold mb-6 animate-scale-in">
          <CardContent className="p-6 text-center">
            <Badge className="mb-2 bg-wine-primary text-cream-base text-lg px-4 py-2">
              {statusConfig[currentStatus].label}
            </Badge>
            <p className="text-deep-brown">
              {currentStatus === 'pending' && "Your order has been received and will be prepared shortly."}
              {currentStatus === 'preparing' && "Our chefs are preparing your order with care."}
              {currentStatus === 'ready' && "Your order is ready! Please wait for service."}
              {currentStatus === 'completed' && "Thank you for dining with us!"}
            </p>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="card-premium animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-playfair text-deep-brown">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-warm-grey last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="bg-wine-primary text-cream-base rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <span className="font-medium text-deep-brown">{item.name}</span>
                  </div>
                  <span className="text-wine-primary font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 text-xl font-bold">
                <span className="text-deep-brown">Total</span>
                <span className="text-wine-primary">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Message */}
        <div className="text-center mt-6 p-4 bg-warm-grey/30 rounded-lg animate-fade-in">
          <p className="text-deep-brown">
            <strong>Estimated delivery:</strong> {Math.max(5, 25 - Math.floor(Date.now() / 1000) % 20)} minutes
          </p>
          <p className="text-sm text-warm-grey mt-1">
            Your server will bring your order to table {tableNumber}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;