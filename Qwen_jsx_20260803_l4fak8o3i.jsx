import MagicRuneCircle from "./MagicRuneCircle";

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(circle at center, #120624 0%, #070210 60%, #030108 100%)",
    }}>
      <MagicRuneCircle size={420} speed={24} />
    </div>
  );
}