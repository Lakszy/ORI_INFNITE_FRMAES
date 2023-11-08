import { Result } from '../interface';
import React, { useState } from 'react';

interface ICard {
  res: Result;
}

export const Card = ({ res }: ICard) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalImageClick = (e: { stopPropagation: () => void; }) => {
    // Prevent the click event from bubbling up to the modal container
    e.stopPropagation();
  };

  return (
    <div className="card" onClick={openModal}>
      <img
        src={`https://farm${res.farm}.staticflickr.com/${res.server}/${res.id}_${res.secret}.jpg`}
        alt={`Image ${res.id}`}
      />

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img
              src={`https://farm${res.farm}.staticflickr.com/${res.server}/${res.id}_${res.secret}.jpg`}
              alt={`Image ${res.id}`}
              onClick={handleModalImageClick}
            />
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
