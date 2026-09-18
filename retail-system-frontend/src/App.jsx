import { BrowserRouter, Routes, Route } from "react-router-dom";

import Stores from "./pages/Stores";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Orders from "./pages/Orders";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/stores"
                    element={<Stores />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/inventory"
                    element={<Inventory/>}
                />

                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/sales" element={<Sales />} />
            </Routes>

        </BrowserRouter>
    );
}


export default App;