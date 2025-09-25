import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import "./styles/base.css";
import "./styles/leaflet.css";
import { SnackbarProvider } from "./context/SnackbarContext";

const base = import.meta.env.VITE_BASE_PATH || "/";

function App() {
  return (
    <BrowserRouter basename={base}>
      <SnackbarProvider>
        <AppRoutes />
      </SnackbarProvider>
    </BrowserRouter>

  );
}

export default App;
