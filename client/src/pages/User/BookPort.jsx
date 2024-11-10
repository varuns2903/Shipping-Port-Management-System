import React, { useState } from 'react';
import axios from 'axios';

function BookPort() {
    const [userId, setUserId] = useState('');
    const [portId, setPortId] = useState('');
    const [shipId, setShipId] = useState('');

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/bookings/book', { user_id: userId, port_id: portId, ship_id: shipId });
            alert('Booking Successful! ID: ' + response.data.bookingId);
        } catch (error) {
            console.error('Error booking port:', error);
        }
    };

    return (
        <div className="container">
            <h1>Book a Port</h1>
            <form onSubmit={handleBooking}>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" required />
                <input type="text" value={portId} onChange={(e) => setPortId(e.target.value)} placeholder="Port ID" required />
                <input type="text" value={shipId} onChange={(e) => setShipId(e.target.value)} placeholder="Ship ID" required />
                <button type="submit">Book Port</button>
            </form>
        </div>
    );
}

export default BookPort;
