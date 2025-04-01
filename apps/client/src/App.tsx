import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppSidebar from './components/sidebar/app-sidebar';
import { SidebarTrigger } from './components/ui/sidebar';
import { SidebarProvider } from './components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import Shop from './pages/ShopPage';
import CreateLicense from './pages/CreateLicensePage';

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-grow h-screen w-full bg-slate-900 items-center justify-center relative">
        <SidebarTrigger style={{ position: 'absolute', top: 0, left: 0 }} />
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
          <Route
            path="/user-licenses"
            element={<Shop />}
          />
          <Route
            path="/vendor-licenses"
            element={<Shop />}
          />
          <Route
            path="/create-license"
            element={<CreateLicense />}
          />
        </Route>
      </Routes>
    </Router>
  );
}
