import { Routes, Route } from "react-router-dom";
import { MainSelectUser } from "./screens/MainSelectUser";
import { MainMap } from "./screens/MainMap";

// 라우팅용
export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MainSelectUser />} />
            <Route path="/map/:role" element={<MainMap />} />
        </Routes>
    );
}