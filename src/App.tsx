import SortableList from "./components/SortableList";

function App() {
  return (
    <div className="App">
      <SortableList
        items={[
          <div style={{ height: 100, width: 100, backgroundColor: "lightblue"}}>1</div>,
          <div style={{ height: 100, width: 100, backgroundColor: "lightcoral"}}>2</div>,
          <div style={{ height: 100, width: 100, backgroundColor: "lightgreen"}}>3</div>,
          <div style={{ height: 100, width: 100, backgroundColor: "lightsalmon"}}>4</div>,
          <div style={{ height: 100, width: 100, backgroundColor: "lightcyan"}}>5</div>,
        ]}
        dragItemConfig={{ position: { x: 20, y: 50 } }}
      />
    </div>
  );
}

export default App;
