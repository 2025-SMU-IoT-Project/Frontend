import { Routes, Route } from "react-router-dom";
import { MainSelectUser } from "./screens/MainSelectUser";
import { MainMap } from "./screens/MainMap";
import EventList from "./screens/EventList/EventList";
import EventDetail from "./screens/EventDetail/EventDetail";
import { Dashboard } from "./screens/Dashboard";

// 라우팅용
export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MainSelectUser />} />
            <Route path="/map/:role" element={<MainMap />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:uuid" element={<EventDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}