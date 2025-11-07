import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MainSelectUser } from "./screens/MainSelectUser";
import "./index.css";

createRoot(document.getElementById("app")).render(
    <StrictMode>
        <MainSelectUser />
    </StrictMode> 
);
