

// import ProductList from "./components/DBProducts/ProductList";

// import CategoryPage from "./components/CategoryPage"



//  import Login from "./pages/Login"
// import ProductsPage from "./pages/ProductPage;
 import AppRoutes from "./Routes/AppRoutes"
import { BrowserRouter } from "react-router-dom"




// import AddProduct from './components/AddProduct'





function App() {
 

  return (
    <>
      
      {/* <AddProduct/>
      <ProductList/>  */}
       {/* <ProductsPage />  */}
      {/* <Login/> */}
       <BrowserRouter>
      <AppRoutes/> 
      
    
      </BrowserRouter>
       
    </>
  )
}

export default App
