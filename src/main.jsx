import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./Context/AuthContext";

createRoot(document.getElementById("root")).render(
  <>
    <AuthProvider>
      <App />
    </AuthProvider>
  </>
);
