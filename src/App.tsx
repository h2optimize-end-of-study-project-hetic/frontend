import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/routes";
import "./styles/base.css";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
