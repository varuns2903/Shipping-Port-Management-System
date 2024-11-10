import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TrackShipments() {
    const [userId, setUserId] = useState('');
    const [shipments, setShipments] = useState([]);

    const handleTrack = async () => {
        try {
            const response = await axios.get(`/api/shipments/${userId}`);
            setShipments(response.data);
        } catch (error) {
            console.error('Error fetching shipments:', error);
        }
    };

    return (
        <div className="container">
            <h1>Track Shipments</h1>
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
            <button onClick={handleTrack}>Track</button>
            <ul>
                {shipments.map((shipment) => (
                    <li key={shipment.container_id}>
                        Container ID: {shipment.container_id}, Type: {shipment.container_type}, Weight: {shipment.weight}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TrackShipments;
