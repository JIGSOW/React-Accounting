import './App.css'
import React from 'react'
const Login = React.lazy(() => import('./Screens/User/Login'))
const Register = React.lazy(() => import('./Screens/User/Register'))
const Resetpass = React.lazy(() => import('./Screens/User/Resertpass'))
const SetAccount = React.lazy(() => import('./Screens/Accountsetup/Setaccount'))
const MainSellScreen = React.lazy(() => import('./Screens/MainScreen/Mainscreen'))
const Customers = React.lazy(() => import('./Screens/MainScreen/Customers'))
const SellCustomer = React.lazy(() => import('./Screens/MainScreen/Sellcustomer'))
const MoneyIncome = React.lazy(() => import('./Screens/MainScreen/Moneyincome'))
const Payments = React.lazy(() => import('./Screens/MainScreen/Payments'))
const Types = React.lazy(() => import('./Screens/MainScreen/Types'))
const Supplies = React.lazy(() => import('./Screens/MainScreen/Supplies'))
const Reciepts = React.lazy(() => import('./Screens/MainScreen/Reciepts'))
const Employee = React.lazy(() => import('./Screens/MainScreen/Employee'))
const mathNotes = React.lazy(() => import('./Screens/ai/MathNotes'))
const NotFound = React.lazy(() => import('./Screens/Notfound/Notfound'))
import Loading from './Screens/LoadingScreen/Loading'
const DispatchSupplies = React.lazy(() => import('./Screens/MainScreen/Dispatchsupplies'))
const Inventory = React.lazy(() => import('./Screens/MainScreen/Inventory'))
const Options = React.lazy(() => import('./Screens/MainScreen/Options'))
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from './Tools/AuthContext';
import PrivateRoute from './Tools/PrivateRoute';





function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-pass" element={<Resetpass />} />
            <Route path="/setup-account" element={<PrivateRoute element={SetAccount} />} />
            <Route path="/main" element={<PrivateRoute element={MainSellScreen} />} />
            <Route path="/main/customers" element={<PrivateRoute element={Customers} />} />
            <Route path="/main/sell-customers" element={<PrivateRoute element={SellCustomer} />} />
            <Route path="/main/money-income" element={<PrivateRoute element={MoneyIncome} />} />
            <Route path="/main/payments" element={<PrivateRoute element={Payments} />} />
            <Route path="/main/types" element={<PrivateRoute element={Types} />} />
            <Route path="/main/supplies" element={<PrivateRoute element={Supplies} />} />
            <Route path="/main/dispatch-supplies" element={<PrivateRoute element={DispatchSupplies} />} />
            <Route path="/main/reciepts" element={<PrivateRoute element={Reciepts} />} />
            <Route path="/main/employees" element={<PrivateRoute element={Employee} />} />
            <Route path="/main/inventory" element={<PrivateRoute element={Inventory} />} />
            <Route path="/math-notes" element={<PrivateRoute element={mathNotes} />} />
            <Route path="/main/options" element={<PrivateRoute element={Options} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Suspense>
    </AuthProvider>
  )
}

export default App
