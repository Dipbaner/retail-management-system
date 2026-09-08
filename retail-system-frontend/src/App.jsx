import { BrowserRouter, Routes, Route } from "react-router-dom";

import Stores from "./pages/Stores";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";


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

            </Routes>

        </BrowserRouter>
    );
}


export default App;