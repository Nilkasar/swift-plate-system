import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TableEntry from '@/components/TableEntry';
import MenuDisplay from '@/components/MenuDisplay';
import OrderStatus from '@/components/OrderStatus';
import AdminDashboard from '@/components/AdminDashboard';
import ChefPanel from '@/components/ChefPanel';
import { Users, ChefHat, Shield, UtensilsCrossed } from 'lucide-react';

type View = 'entry' | 'menu' | 'order-status' | 'admin' | 'chef';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  prepTime: string;
  quantity: number;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('entry');
  const [tableNumber, setTableNumber] = useState('');
  const [currentOrder, setCurrentOrder] = useState<CartItem[]>([]);

  const handleTableSubmit = (table: string) => {
    setTableNumber(table);
    setCurrentView('menu');
  };

  const handleProceedToOrder = (cart: CartItem[]) => {
    setCurrentOrder(cart);
    setCurrentView('order-status');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  // Landing page with role selection
  if (currentView === 'entry' && !tableNumber) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-4xl animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-6 shadow-[var(--shadow-primary)] animate-float">
              <UtensilsCrossed className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-playfair font-bold text-foreground mb-4">
              Bella Vista
            </h1>
            <p className="text-xl text-neutral-600">Premium Dining Experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Customer Entry */}
            <Card className="card-premium hover:scale-105 transition-transform cursor-pointer animate-slide-up" onClick={() => handleTableSubmit('')}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-primary)]">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-foreground mb-2">Customer</h3>
                <p className="text-neutral-600 mb-4">Browse menu and place orders</p>
                <Button className="btn-primary w-full">Start Ordering</Button>
              </CardContent>
            </Card>

            {/* Admin Panel */}
            <Card className="card-premium hover:scale-105 transition-transform cursor-pointer animate-slide-up" onClick={() => setCurrentView('admin')}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-md)]">
                  <Shield className="w-8 h-8 text-neutral-50" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-foreground mb-2">Admin</h3>
                <p className="text-neutral-600 mb-4">Manage orders and operations</p>
                <Button className="btn-secondary w-full">Admin Dashboard</Button>
              </CardContent>
            </Card>

            {/* Chef Panel */}
            <Card className="card-premium hover:scale-105 transition-transform cursor-pointer animate-slide-up" onClick={() => setCurrentView('chef')}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-md)]">
                  <ChefHat className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-foreground mb-2">Chef</h3>
                <p className="text-neutral-600 mb-4">Manage kitchen orders</p>
                <Button className="btn-outline w-full">Chef Panel</Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 text-sm text-neutral-500">
            <p>Experience premium dining with our modern ordering system</p>
          </div>
        </div>
      </div>
    );
  }

  // Route to different views
  switch (currentView) {
    case 'entry':
      return <TableEntry onTableSubmit={handleTableSubmit} />;
    case 'menu':
      return <MenuDisplay tableNumber={tableNumber} onProceedToOrder={handleProceedToOrder} />;
    case 'order-status':
      return <OrderStatus tableNumber={tableNumber} order={currentOrder} onBackToMenu={handleBackToMenu} />;
    case 'admin':
      return <AdminDashboard />;
    case 'chef':
      return <ChefPanel />;
    default:
      return <TableEntry onTableSubmit={handleTableSubmit} />;
  }
};

export default Index;
