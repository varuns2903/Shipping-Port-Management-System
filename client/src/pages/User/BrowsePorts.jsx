import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BrowsePorts() {
    const [ports, setPorts] = useState([]);

    useEffect(() => {
        const fetchPorts = async () => {
            const response = await axios.get('/api/ports/all');
            setPorts(response.data);
        };
        fetchPorts();
    }, []);

    return (
        <div className="container">
            <h1>Browse Ports</h1>
            <ul>
                {ports.map(port => (
                    <li key={port.port_id}>
                        {port.port_name} - Available Space: {port.available_space}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BrowsePorts;
