import Products from "./component/Product"


function App() {

  return (
    <div>
      <Products onSelectUser={function (id: number | null): void {
        throw new Error("Function not implemented.")
      } } refreshKey={0}/>
   </div>
  )
}

export default App
