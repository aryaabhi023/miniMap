import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import { MdDelete } from "react-icons/md";
import "reactflow/dist/style.css";

const styles = {
  button: {
    padding: "5px 8px",
    margin: "5px ",
    backgroundColor: "#00afee",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  node: {
    borderRadius: "50%",
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    cursor: "pointer",
    color: "red",
    zIndex: 1,
  },
  formContainer: {
    width: "230px",
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    border: "2px solid #ccc",
    borderRadius: 5,
    background: "#fff",
    display: "block",
  },
  formInput: {
    marginBottom: 5,
    display: "block",
  },
  h5: {
    marginTop: "2px",
    padding: "2px",
    borderBottom: "1px solid #ccc",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cButton: {
    marginLeft: "6px",
    marginBottom: "8px",
    borderRadius: "20px",
    padding: "2px 8px",
    border: "1px solid",
  },
};

const initialNodes = [];
const initialEdges = [];

export default function Component() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState(null);
  const [label, setLabel] = useState("");

  const createNode = () => {
    const obj = {
      id: `${Math.floor(Math.random() * 100000)}`,
      position: { x: 0, y: 0 },
      data: { label: `new Node` },
      style: styles.node,
    };
    setNodes((prevNodes) => [...prevNodes, obj]);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (e, val) => {
    setShowForm(!showForm);
    setId(val.id);
    setLabel(val.data.label);
  };

  const onEdgeClick = (e, val) => {
    const newEdges = edges.filter(
      (edge) => edge.source !== val.source && edge.target !== val.target
    );
    setEdges(newEdges);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedNodes = nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            label,
          },
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    setShowForm(false);
  };

  const removeNode = () => {
    const newEdges = edges.filter(
      (edge) => edge.source !== id && edge.target !== id
    );
    const newNodes = nodes.filter((node) => node.id !== id);
    setNodes(newNodes);
    setEdges(newEdges);
    setShowForm(false);
  };

  return (
    <>
      <button style={styles.button} onClick={createNode}>
        Create Node
      </button>
      <div style={{ width: "98vw", height: "85vh" }}>
        <ReactFlow
          nodes={nodes}
          onNodeClick={(e, val) => onNodeClick(e, val)}
          onEdgeClick={(e, val) => {
            onEdgeClick(e, val);
          }}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
          <Background variant="lines" gap={12} size={1} />
        </ReactFlow>
        {showForm && (
          <div style={styles.formContainer}>
            <MdDelete
              style={{ float: "right", color: "red" }}
              onClick={removeNode}
            />
            <h5 style={styles.h5}>Edit Node Name</h5>
            <form onSubmit={handleSubmit}>
              <button style={styles.cButton} onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  ...styles.cButton,
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                Save
              </button>
              <textarea
                rows={5}
                cols={27}
                value={label}
                style={{ width: "97%" }}
                onChange={(e) => setLabel(e.target.value)}
              />
            </form>
          </div>
        )}
      </div>
    </>
  );
}
