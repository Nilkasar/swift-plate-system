import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, ChefHat, Utensils, ArrowLeft, Plus, Star, MessageSquare, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  images?: string[];
}

interface EnhancedOrderStatusProps {
  tableNumber: string;
  order: OrderItem[];
  onBackToMenu: () => void;
  onAddMoreItems: () => void;
}

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'closed';

const statusConfig = {
  pending: { 
    label: 'Order Received', 
    icon: Clock, 
    color: 'bg-yellow-500',
    description: 'Your order has been received and will be prepared shortly.',
    progress: 20
  },
  preparing: { 
    label: 'Preparing', 
    icon: ChefHat, 
    color: 'bg-blue-500',
    description: 'Our chefs are preparing your order with care.',
    progress: 50
  },
  ready: { 
    label: 'Ready', 
    icon: Utensils, 
    color: 'bg-green-500',
    description: 'Your order is ready! Please wait for service.',
    progress: 80
  },
  completed: { 
    label: 'Served', 
    icon: CheckCircle, 
    color: 'bg-green-600',
    description: 'Your order has been served. Enjoy your meal!',
    progress: 100
  },
  closed: { 
    label: 'Closed', 
    icon: CheckCircle, 
    color: 'bg-gray-600',
    description: 'Order completed. Thank you for dining with us!',
    progress: 100
  }
};

const EnhancedOrderStatus = ({ tableNumber, order, onBackToMenu, onAddMoreItems }: EnhancedOrderStatusProps) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending');
  const [orderTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [canAddMore, setCanAddMore] = useState(true);
  const { toast } = useToast();

  // Simulate order progress
  useEffect(() => {
    const progressOrder = () => {
      setTimeout(() => setCurrentStatus('preparing'), 3000);
      setTimeout(() => setCurrentStatus('ready'), 8000);
      setTimeout(() => setCurrentStatus('completed'), 12000);
      setTimeout(() => setCanAddMore(false), 15000); // Can't add more after 15 seconds
    };
    progressOrder();
  }, []);

  const getTotalPrice = () => {
    return order.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getEstimatedTime = () => {
    const baseTime = 25;
    const elapsed = Math.floor((Date.now() - orderTime.getTime()) / 1000);
    return Math.max(5, baseTime - elapsed);
  };

  const handleCloseOrder = () => {
    setCurrentStatus('closed');
    setShowFeedback(true);
    setCanAddMore(false);
  };

  const handleSubmitFeedback = () => {
    if (rating > 0) {
      toast({
        title: "Feedback submitted!",
        description: "Thank you for your valuable feedback.",
      });
      setShowFeedback(false);
    } else {
      toast({
        title: "Please rate your experience",
        description: "Rating is required to submit feedback.",
        variant: "destructive"
      });
    }
  };

  const currentConfig = statusConfig[currentStatus];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4 py-6">
        {/* Enhanced Header with Branding */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBackToMenu} className="btn-outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
            <div>
              <h1 className="text-3xl font-playfair font-bold text-foreground">Bella Vista</h1>
              <p className="text-muted-foreground">Order Status</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-primary">Table {tableNumber}</p>
            <p className="text-sm text-muted-foreground">{orderTime.toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <Card className="card-premium mb-6 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl font-playfair text-foreground flex items-center gap-2">
              <currentConfig.icon className="w-6 h-6 text-primary" />
              Order Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">{currentConfig.label}</span>
                <span className="text-sm text-muted-foreground">{currentConfig.progress}%</span>
              </div>
              <Progress value={currentConfig.progress} className="h-3" />
            </div>
            
            {/* Status Timeline */}
            <div className="flex items-center justify-between relative pt-4">
              <div className="absolute top-10 left-6 right-6 h-0.5 bg-border">
                <div 
                  className="h-full bg-primary transition-all duration-2000 ease-out"
                  style={{ width: `${currentConfig.progress}%` }}
                />
              </div>

              {Object.entries(statusConfig).filter(([key]) => key !== 'closed').map(([status, config], index) => {
                const Icon = config.icon;
                const isActive = statusConfig[currentStatus].progress >= config.progress;
                const isCurrent = status === currentStatus;

                return (
                  <div key={status} className="flex flex-col items-center relative z-10">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                      ${isActive ? config.color : 'bg-border'}
                      ${isCurrent ? 'scale-110 animate-status-pulse' : ''}
                    `}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className={`
                      mt-2 text-xs font-medium text-center
                      ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                    `}>
                      {config.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-foreground font-medium">{currentConfig.description}</p>
              {currentStatus !== 'completed' && currentStatus !== 'closed' && (
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Estimated time:</strong> {getEstimatedTime()} minutes
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {currentStatus === 'completed' && !showFeedback && (
          <div className="flex gap-4 mb-6 animate-bounce-in">
            {canAddMore && (
              <Button
                onClick={onAddMoreItems}
                className="btn-outline flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More Items
              </Button>
            )}
            <Button
              onClick={handleCloseOrder}
              className="btn-primary flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Close Order
            </Button>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedback && (
          <Card className="card-premium mb-6 animate-scale-in border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-playfair text-foreground flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  How was your experience?
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowFeedback(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Rate your experience:</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-colors"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Additional feedback (optional):</p>
                <Textarea
                  placeholder="Tell us about your dining experience..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleSubmitFeedback} className="btn-primary flex-1">
                  Submit Feedback
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFeedback(false)}
                  className="btn-outline"
                >
                  Skip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        <Card className="card-premium animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-playfair text-foreground">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.map(item => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-border last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <span className="text-primary font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 text-xl font-bold border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Message */}
        {currentStatus !== 'closed' && (
          <div className="text-center mt-6 p-4 bg-secondary/30 rounded-lg animate-fade-in">
            <p className="text-foreground">
              <strong>Table Service:</strong> Your server will bring your order to table {tableNumber}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Thank you for choosing Bella Vista
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedOrderStatus;