import SortableList from "./components/SortableList";

function App() {
  return (
    <div className="App">
      <SortableList
        items={[
          "1", "2", "3", "4"
        ]}
      />
    </div>
  );
}

export default App;
