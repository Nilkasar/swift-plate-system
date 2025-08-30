import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MenuDisplay from "@/components/MenuDisplay";
import EnhancedOrderStatus from "@/components/EnhancedOrderStatus";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  images?: string[];
}

const CustomerOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<'table' | 'menu' | 'order'>('table');
  const [tableNumber, setTableNumber] = useState("");
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);

  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableNumber.trim()) {
      setCurrentView('menu');
    }
  };

  const handleProceedToOrder = (order: OrderItem[]) => {
    setCurrentOrder(order);
    setCurrentView('order');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  if (currentView === 'table') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToLanding}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-primary mb-2">Bella Vista</h1>
            <p className="text-muted-foreground">Fine Dining Experience</p>
          </div>

          <Card className="backdrop-blur-sm bg-card/90 shadow-xl border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">Welcome!</CardTitle>
              <CardDescription className="text-muted-foreground">
                Please enter your table number to view our menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTableSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter table number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="text-center text-lg py-3"
                    autoFocus
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full py-3 text-lg font-semibold"
                  disabled={!tableNumber.trim()}
                >
                  View Menu
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === 'menu') {
    return (
      <MenuDisplay
        tableNumber={tableNumber}
        onProceedToOrder={handleProceedToOrder}
      />
    );
  }

  return (
    <EnhancedOrderStatus
      tableNumber={tableNumber}
      order={currentOrder}
      onBackToMenu={() => setCurrentView('menu')}
      onAddMoreItems={() => setCurrentView('menu')}
    />
  );
};

export default CustomerOrder;