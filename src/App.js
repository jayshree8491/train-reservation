import React, { useState } from 'react';

const TOTAL_SEATS = 80;
const SEATS_PER_ROW = 7;
const LAST_ROW_SEATS = 3;

const SeatReservationApp = () => {
  const [seatMap, setSeatMap] = useState(
    Array.from({ length: Math.ceil(TOTAL_SEATS / SEATS_PER_ROW) }, () =>
      Array(SEATS_PER_ROW).fill(0)
    )
  );
  const [reservedSeats, setReservedSeats] = useState([]);

  const reserveSeats = (numSeats) => {
    if (numSeats > TOTAL_SEATS - reservedSeats.length) {
      alert('Insufficient seats available.');
      return;
    }

    let newSeatMap = [...seatMap];
    let newReservedSeats = [...reservedSeats];

    // Find consecutive available seats in one row
    let rowIndex = newSeatMap.findIndex(
      (row) => row.filter((seat) => seat === 0).length >= numSeats
    );

    if (rowIndex === -1) {
      // Find available seats in nearby rows
      let nearbySeats = [];
      newSeatMap.forEach((row, rowIndex) => {
        row.forEach((seat, colIndex) => {
          if (seat === 0) {
            nearbySeats.push({ row: rowIndex, col: colIndex });
          }
        });
      });

      if (nearbySeats.length === 0) {
        alert('No seats available.');
        return;
      }

      // Sort seats based on Manhattan distance from the center
      nearbySeats.sort(
        (a, b) =>
          Math.abs(a.row - Math.floor(seatMap.length / 2)) +
          Math.abs(a.col - Math.floor(SEATS_PER_ROW / 2)) -
          (Math.abs(b.row - Math.floor(seatMap.length / 2)) +
            Math.abs(b.col - Math.floor(SEATS_PER_ROW / 2)))
      );

      rowIndex = nearbySeats[0].row;
    }

    const startCol = newSeatMap[rowIndex].indexOf(0);
    const endCol = startCol + numSeats;

    if (endCol <= SEATS_PER_ROW) {
      newSeatMap[rowIndex].fill(1, startCol, endCol);
    } else {
      const remainingSeats = SEATS_PER_ROW - startCol;
      newSeatMap[rowIndex].fill(1, startCol);
      newSeatMap[rowIndex + 1].fill(
        1,
        0,
        numSeats - remainingSeats
      );
    }

    // Update the reserved seats
    for (let r = 0; r < newSeatMap.length; r++) {
      for (let c = 0; c < SEATS_PER_ROW; c++) {
        if (newSeatMap[r][c] === 1) {
          const seatNumber = r * SEATS_PER_ROW + c + 1;
          newReservedSeats.push(seatNumber);
        }
      }
    }

    setSeatMap(newSeatMap);
    setReservedSeats(newReservedSeats);
  };

  const renderSeatMap = () => {
    return seatMap.map((row, rowIndex) => (
      <div key={rowIndex} className="seat-row">
        {row.map((seat, colIndex) => (
          <div
            key={colIndex}
            className={`seat ${seat === 1 ? 'reserved' : 'available'}`}
          >
            {rowIndex * SEATS_PER_ROW + colIndex + 1}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="seat-reservation-app">
      <h1>Seat Reservation App</h1>
      <div className="seat-map">{renderSeatMap()}</div>
      <div className="controls">
        <button onClick={() => reserveSeats(1)}>Reserve 1 Seat</button>
        <button onClick={() => reserveSeats(2)}>Reserve 2 Seats</button>
        <button onClick={() => reserveSeats(4)}>Reserve 4 Seats</button>
        <button onClick={() => reserveSeats(6)}>Reserve 6 Seats</button>
      </div>
      {reservedSeats.length > 0 && (
        <div className="reserved-seats">
          <h3>Reserved Seats:</h3>
          {reservedSeats.join(', ')}
        </div>
      )}
    </div>
  );
};

export default SeatReservationApp;
