import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/routes";
import "./styles/base.css";
import "./styles/leaflet.css";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
