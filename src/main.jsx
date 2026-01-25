import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CombinedProvider } from "./providers/CombinedProvider";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CombinedProvider>
      <App />
    </CombinedProvider>
  </BrowserRouter>
);
