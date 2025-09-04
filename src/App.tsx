import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import "./styles/base.css";
import "./styles/leaflet.css";

const base = import.meta.env.VITE_BASE_PATH || "/";

function App() {
  return (
    <BrowserRouter basename={base}>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
