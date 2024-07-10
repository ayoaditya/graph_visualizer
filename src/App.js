import React, { useState, useRef } from "react";
import { GraphCanvas, darkTheme, useSelection } from "reagraph";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { processGraphInput } from "./processGraphInput";
import { bfsTraversal } from "./bfsTraversal";
import "./App.css"; // Import your CSS file
import { dfsTraversal } from "./dfsTraversal";
import { topologicalSort } from "./topologicalSort";
import { ShortestPath } from "./ShortestPath";
import { toast, Bounce } from "react-toastify";
function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [shortestDistance, setShortestDistance] = useState("∞");
  const [destinationValue, setDestinationValue] = useState("");
  const [sourceValue, setSourceValue] = useState("");
  const [graphType, setGraphType] = useState("directed"); // State for graph type

  const graphRef = useRef(null);

  const [isWeightedChecked, setIsWeightedChecked] = useState(false);
  const [isUnweightedChecked, setIsUnweightedChecked] = useState(true);
  // Handlers to update the state
  const handleWeightedChange = (event) => {
    setIsWeightedChecked(event.target.checked);
    if (event.target.checked) {
      setIsUnweightedChecked(false);
    }
  };

  const handleUnweightedChange = (event) => {
    setIsUnweightedChecked(event.target.checked);
    if (event.target.checked) {
      setIsWeightedChecked(false);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSourceChange = (event) => {
    setSourceValue(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestinationValue(event.target.value);
  };

  const findShortestPath = () => {
    console.log(sourceValue);
    console.log(destinationValue);

    const result = ShortestPath(
      inputValue,
      sourceValue,
      destinationValue,
      isWeightedChecked
    );
    console.log("AFTER");
    console.log(result.nodes);
    console.log(result.edges);
    console.log(result.shortestDistance);
    if (result.error) {
      console.error("Invalid input format or empty graph.");
      toast.error(result.error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      setNodes(result.nodes);
      setEdges(result.edges);
      setShortestDistance(result.shortestDistance);
    }
  };

  const handleSubmit = () => {
    console.log(typeof inputValue);
    console.log(inputValue);
    const { nodes: newNodes, edges: newEdges } = processGraphInput(inputValue);
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      console.error("Invalid input format or empty graph.");
    }
  };

  const { selections, onNodeClick, onCanvasClick } = useSelection({
    ref: graphRef,
    nodes,
    edges,
    type: "single",
  });

  const handleExportGraph = () => {
    if (graphRef.current) {
      const data = graphRef.current.exportCanvas();

      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("target", "_blank");
      link.setAttribute("download", "graph.png");
      link.click();
    }
  };

  const handleDirectedGraph = () => {
    setGraphType("directed");
  };

  const handleUndirectedGraph = () => {
    setGraphType("undirected");
  };

  const handleTopologicalSort = () => {
    //topologicalSort result
    console.log(inputValue);
    const { nodes: newNodes, edges: newEdges } = topologicalSort(
      inputValue,
      "1"
    );
    console.log(newNodes);
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      console.error("Invalid input format or empty graph.");
    }
  };

  const handleBFS = () => {
    // BFS result
    console.log(inputValue);
    const { nodes: newNodes, edges: newEdges } = bfsTraversal(inputValue);
    console.log(newNodes);
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      console.error("Invalid input format or empty graph.");
    }
  };

  const handleDFS = () => {
    // DFS result
    console.log(inputValue);
    const { nodes: newNodes, edges: newEdges } = dfsTraversal(inputValue);
    console.log(newNodes);
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      console.error("Invalid input format or empty graph.");
    }
  };

  const handleTree = () => {
    // Implement Tree functionality
    console.log("Tree");
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <button onClick={handleDirectedGraph}>Directed Graph</button>
        <button onClick={handleUndirectedGraph}>Undirected Graph</button>
        <button onClick={handleTopologicalSort}>Topological Sort</button>
        <button onClick={handleBFS}>BFS</button>
        <button onClick={handleDFS}>DFS</button>
        <button onClick={handleTree}>Tree</button>
      </div>
      <div className="container">
        <div className="input-section">
          <label>
            <input
              type="checkbox"
              checked={isWeightedChecked}
              onChange={handleWeightedChange}
            />
            Weighted
          </label>
          <label>
            <input
              type="checkbox"
              checked={isUnweightedChecked}
              onChange={handleUnweightedChange}
            />
            Unweighted
          </label>

          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter nodes and edges (e.g., 1->2\n2->3)"
            className="textarea-input"
          />
          <button
            onClick={handleSubmit}
            style={{ width: "100%", marginTop: "10px" }}
          >
            Submit
          </button>
          <button onClick={handleExportGraph}>Export Graph</button>
          <h1>SHORTEST PATH</h1>
          <input
            type="text"
            placeholder="Enter Source Node"
            onChange={handleSourceChange}
          />
          <input
            type="text"
            placeholder="Enter Destination Node"
            onChange={handleDestinationChange}
          />
          <button onClick={findShortestPath}>FIND SHORTEST PATH</button>
          <h3>
            Shortest Distance Between {sourceValue} And {destinationValue} Is:
            {shortestDistance}
          </h3>
        </div>
        <div className="graph-section">
          <GraphCanvas
            layoutType="treeLr2d"
            labelType="all"
            edgeLabelPosition="below"
            edgeArrowPosition={graphType === "undirected" ? "none" : "end"} // Update edge arrow position based on graph type
            theme={darkTheme} // for dark theme use darkTheme
            ref={graphRef}
            draggable
            nodes={nodes}
            edges={edges}
            selections={selections}
            onCanvasClick={onCanvasClick}
            onNodeClick={onNodeClick}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
