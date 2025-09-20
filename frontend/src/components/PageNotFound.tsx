import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Generate breadcrumbs from the current path
  //const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Page Not Found' }
  ];

  const currentPath = location.pathname;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-3xl text-destructive">404</CardTitle>
            <CardTitle className="text-xl">Page Not Found</CardTitle>
            <CardDescription className="text-center">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Requested URL:</strong>
              </p>
              <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                {currentPath}
              </code>
            </div>
            
            <Badge variant="destructive" className="text-sm">
              Route Not Found
            </Badge>
            
            <p className="text-sm text-muted-foreground">
              This route is not defined in our application. You'll be redirected to the dashboard automatically.
            </p>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Auto-redirecting in <strong>{countdown}</strong> seconds...
              </div>
              
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/dashboard">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="flex-1" 
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
