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
      <div className="min-h-screen bg-gradient-to-br from-cosmic-dark via-cosmic-accent to-cosmic-dark flex items-center justify-center p-4">
        <div className="w-full max-w-4xl animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full mb-6 shadow-[var(--shadow-neon)] animate-pulse-glow">
              <UtensilsCrossed className="w-12 h-12 text-cosmic-light" />
            </div>
            <h1 className="text-5xl font-playfair font-bold text-cosmic-light mb-4 bg-gradient-to-r from-neon-purple to-golden-glow bg-clip-text text-transparent">
              Cosmic Bistro
            </h1>
            <p className="text-xl text-cosmic-light/80">Futuristic Dining Experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Customer Entry */}
            <Card className="card-premium hover:scale-105 transition-transform cursor-pointer animate-slide-up animate-order-placed" onClick={() => setCurrentView('entry')}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-neon)]">
                  <Users className="w-8 h-8 text-cosmic-light" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-cosmic-light mb-2">Customer</h3>
                <p className="text-cosmic-light/70 mb-4">Browse menu and place orders</p>
                <Button className="btn-neon w-full">Start Ordering</Button>
              </CardContent>
            </Card>

            {/* Admin Panel */}
            <Card className="card-premium hover:scale-105 transition-transform cursor-pointer animate-slide-up" onClick={() => setCurrentView('admin')}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-golden-glow to-warm-orange rounded-full flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-golden)]">
                  <Shield className="w-8 h-8 text-cosmic-dark" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-cosmic-light mb-2">Admin</h3>
                <p className="text-cosmic-light/70 mb-4">Manage orders and operations</p>
                <Button className="btn-golden w-full">Admin Dashboard</Button>
              </CardContent>
            </Card>

            {/* Chef Panel */}
            <Card className="card-premium hover:scale-105 transition-transform cursor-pointer animate-slide-up" onClick={() => setCurrentView('chef')}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-cyber-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-cyber)]">
                  <ChefHat className="w-8 h-8 text-cosmic-dark" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-cosmic-light mb-2">Chef</h3>
                <p className="text-cosmic-light/70 mb-4">Manage kitchen orders</p>
                <Button className="btn-cyber w-full">Chef Panel</Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 text-sm text-cosmic-light/60">
            <p>Experience the future of dining with our AI-powered ordering system</p>
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
