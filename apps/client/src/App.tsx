import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppSidebar from './components/sidebar/app-sidebar';
import { SidebarTrigger } from './components/ui/sidebar';
import { SidebarProvider } from './components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import Shop from './pages/ShopPage';

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-grow h-screen w-full bg-slate-900">
        <SidebarTrigger />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Layout />}
        >
          <Route
            path="/shop"
            element={<Shop />}
          />
        </Route>
      </Routes>
    </Router>
  );
}
