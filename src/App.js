import React, { useState, useRef } from "react";
import { GraphCanvas, darkTheme, useSelection } from "reagraph";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProcessGraphInput } from "./Components/ProcessGraphInput";
import { BfsTraversal } from "./Components/BfsTraversal";
import "./App.css"; // Import your CSS file
import { DfsTraversal } from "./Components/DfsTraversal";
import { TopologicalSort } from "./Components/TopologicalSort";
import { ShortestPath } from "./Components/ShortestPath";
import { toast, Bounce } from "react-toastify";

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [shortestDistance, setShortestDistance] = useState("∞");
  const [destinationValue, setDestinationValue] = useState("");
  const [sourceValue, setSourceValue] = useState("");
  const [layoutTypeGraph, setlayoutTypeGraph] = useState("forceDirected2d");
  const graphRef = useRef(null);

  const [isWeightedChecked, setIsWeightedChecked] = useState(false);
  const [isUnweightedChecked, setIsUnweightedChecked] = useState(true);

  // Handlers to update the state
  const handleWeightedChange = (event) => {
    const checked = event.target.checked;
    setIsWeightedChecked(checked);
    if (checked) {
      setIsUnweightedChecked(false);
    } else {
      setIsUnweightedChecked(true);
    }
  };

  const handleUnweightedChange = (event) => {
    const checked = event.target.checked;
    setIsUnweightedChecked(checked);
    if (checked) {
      setIsWeightedChecked(false);
    } else {
      setIsWeightedChecked(true);
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
      setlayoutTypeGraph("forceDirected2d");
    }
  };

  const handleSubmit = () => {
    console.log(typeof inputValue);
    console.log(inputValue);
    const { nodes: newNodes, edges: newEdges } = ProcessGraphInput(
      inputValue,
      isWeightedChecked
    );
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
      setlayoutTypeGraph("forceDirected2d");
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

  const handleTopologicalSort = () => {
    //topologicalSort result
    console.log(inputValue);
    const { nodes: newNodes, edges: newEdges } = TopologicalSort(
      inputValue,
      isWeightedChecked
    );
    console.log(newNodes);
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
      setlayoutTypeGraph("hierarchicalLr");
    } else {
      console.error("Invalid input format or empty graph.");
    }
  };

  const handleBFS = () => {
    // BFS result
    console.log(inputValue);
    const { nodes: newNodes, edges: newEdges } = BfsTraversal(
      inputValue,
      isWeightedChecked
    );
    console.log(newNodes);
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
      setlayoutTypeGraph("hierarchicalLr");
    } else {
      console.error("Invalid input format or empty graph.");
    }
  };

  const handleDFS = () => {
    // DFS result
    console.log(inputValue);
    const { nodes: newNodes, edges: newEdges } = DfsTraversal(
      inputValue,
      isWeightedChecked
    );
    console.log(newNodes);
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
      setlayoutTypeGraph("hierarchicalLr");
    } else {
      console.error("Invalid input format or empty graph.");
    }
  };

  const handleTree = () => {
    // Implement Tree functionality
    const { nodes: newNodes, edges: newEdges } = ProcessGraphInput(
      inputValue,
      isWeightedChecked
    );
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
      setlayoutTypeGraph("treeTd2d");
    } else {
      console.error("Invalid input format or empty graph.");
    }
    console.log("Tree");
  };
  const handleRandom = () => {
    // Implement Tree functionality
    const { nodes: newNodes, edges: newEdges } = ProcessGraphInput(
      inputValue,
      isWeightedChecked
    );
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
      setlayoutTypeGraph("forceatlas2");
    } else {
      console.error("Invalid input format or empty graph.");
    }
    console.log("Random");
  };

  return (
    <div className="Main">
      <div className="app-container">
        <div className="navbar">
          <label id="weights">
            <label id="unweight">
              <input
                id="checkbox"
                type="checkbox"
                checked={isWeightedChecked}
                onChange={handleWeightedChange}
              />
              Weighted
            </label>
            <label>
              <input
                id="checkbox"
                type="checkbox"
                checked={isUnweightedChecked}
                onChange={handleUnweightedChange}
              />
              Unweighted
            </label>
          </label>
          <button onClick={handleTopologicalSort}>Topological Sort</button>
          <h3>Layout:</h3>
          <button onClick={handleTree}>Tree</button>
          <button onClick={handleRandom}>Random</button>
          <h3>Traversal:</h3>
          <button onClick={handleBFS}>BFS</button>
          <button onClick={handleDFS}>DFS</button>
        </div>
        <div className="container">
          <div className="input-section">
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter nodes and edges (e.g., 1->2\n2->3)"
              className="textarea-input"
            />

            <button
              id="submit_button"
              onClick={handleSubmit}
              style={{ width: "100%", marginTop: "10px" }}
            >
              Submit
            </button>
            <button id="exportButton" onClick={handleExportGraph}>
              Export Graph
            </button>
            <div className="PathClass">
              <h1>SHORTEST PATH</h1>
              <input
                type="text"
                placeholder="Enter Source Node"
                onChange={handleSourceChange}
                id="sourceNode"
              />
              <input
                type="text"
                placeholder="Enter Destination Node"
                onChange={handleDestinationChange}
                id="destinationNode"
              />
              <button id="shortestPath" onClick={findShortestPath}>
                Find Shortest Path
              </button>
              <h3>
                Shortest Distance Between {sourceValue} And {destinationValue}{" "}
                Is: {shortestDistance}
              </h3>
            </div>
          </div>
          <div className="graph-section">
            <GraphCanvas
              layoutType={layoutTypeGraph}
              labelType="all"
              edgeLabelPosition="below"
              edgeArrowPosition="end" // Update edge arrow position based on graph type
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
    </div>
  );
}

export default App;
