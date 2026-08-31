import { BrowserRouter, Routes, Route } from "react-router-dom";

import Stores from "./pages/Stores";
import Products from "./pages/Products";


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

            </Routes>

        </BrowserRouter>
    );
}


export default App;