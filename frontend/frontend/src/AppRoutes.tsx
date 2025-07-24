import { Routes, Route, Navigate, BrowserRouter as Router} from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import AccountantDashboard from './components/dashboards/AccountantDashboard';

import Invoice from './components/pages/Invoice';
import LogoutHandler from './components/LogoutHandler';
import ProfitLossReport from './components/reports/ProfitLossReport';
import InvoiceDetail from './components/pages/InvoiceDetail';
import InvoiceUpdate from './components/pages/InvoiceUpdate';
import InvoiceCreate from './components/pages/InvoiceCreate';
import Expense from './components/pages/Expense';
import ExpenseCreate from './components/pages/ExpenseCreate';
import ExpenseUpdate from './components/pages/ExpenseUpdate';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ClientDashboard from './components/dashboards/ClientDashboard';
import ClientInvoice from './components/pages/ClientInvoice';
import ClientInvoiceDetail from './components/pages/ClientInvoiceDetail';
import ClientProfile from './components/pages/ClientProfile';
import ClientProfileEdite from './components/pages/ClientProfileEdite';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/reset-password/:token' element={<ResetPassword/>}/>
        {user && user.role === 'Accountant' && (
            <>
          <Route path="/dashboard" element={<AccountantDashboard />} />
          <Route path="/invoices" element={<Invoice/>}/>
          <Route path='/logout' element={<LogoutHandler/>}/>
          <Route path='/profit-loss' element={<ProfitLossReport/>}/>
          <Route path='/invoice/:id' element={<InvoiceDetail/>}/>
          <Route path='/invoice/update/:id' element={<InvoiceUpdate/>}/>
          <Route path='/invoice/create' element={<InvoiceCreate/>}/>
          <Route path='/expenses' element={<Expense/>}/>
          <Route path='/expenses/create' element={<ExpenseCreate/>}/>
          <Route path='/expenses/:id/' element={<ExpenseUpdate/>}/>
          </>
        )}

        {user && user.role==='Admin' &&(
          <>
          <Route path="/dashboard" element={<AdminDashboard/>}/>
          <Route path="/invoices" element={<Invoice/>}/>
          <Route path='/logout' element={<LogoutHandler/>}/>
          <Route path='/profit-loss' element={<ProfitLossReport/>}/>
          <Route path='/invoice/:id' element={<InvoiceDetail/>}/>
          <Route path='/invoice/update/:id' element={<InvoiceUpdate/>}/>
          <Route path='/invoice/create' element={<InvoiceCreate/>}/>
          <Route path='/expenses' element={<Expense/>}/>
          <Route path='/expenses/create' element={<ExpenseCreate/>}/>
          <Route path='/expenses/:id/' element={<ExpenseUpdate/>}/>
          <Route path='/register' element={<RegisterForm/>}/>
          </>
        )}

        {user && user.role ==='Client'&&(
          <>
          <Route path='/dashboard' element={<ClientDashboard/>}/>
          <Route path='/invoice' element={<ClientInvoice/>}/>
          <Route path='/logout' element={<LogoutHandler/>}/>
          <Route path='/invoice/:id' element={<ClientInvoiceDetail/>}/>
          <Route path='/profile' element={<ClientProfile/>}/> 
          <Route path='/edit' element={<ClientProfileEdite/>}/>
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
