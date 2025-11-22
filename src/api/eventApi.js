import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/events';

// 1. 이벤트 상세 조회
export const getEventDetail = async (uuid) => {
    try {
        const response = await axios.get(`${BASE_URL}/${uuid}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch event detail for ${uuid}:`, error);
        throw error;
    }
};

// 2. 전체 이벤트 조회 (Cursor Pagination)
export const getAllEvents = async (cursorId, limit = 20) => {
    try {
        const params = { limit };
        if (cursorId) params.cursorId = cursorId;

        const response = await axios.get(`${BASE_URL}`, { params });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all events:", error);
        throw error;
    }
};

// 3. 특정 쓰레기통 이벤트 조회 (Cursor Pagination)
export const getEventsByBin = async (binId, cursorId, limit = 20) => {
    try {
        const params = { limit };
        if (cursorId) params.cursorId = cursorId;

        const response = await axios.get(`${BASE_URL}/bin/${binId}/cursor`, { params });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch events for bin ${binId}:`, error);
        throw error;
    }
};

// 4. 최근 이벤트 조회 (Legacy/Polling용)
export const getRecentEvents = async (binId = 1, limit = 20) => {
    try {
        const response = await axios.get(`${BASE_URL}/recent`, {
            params: { binId, limit }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch recent events:", error);
        throw error;
    }
};

// 5. 날짜 범위 조회
export const getEventsByDateRange = async (binId = 1, startDate, endDate) => {
    try {
        const response = await axios.get(`${BASE_URL}/range`, {
            params: { binId, startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch events by range:", error);
        throw error;
    }
};
