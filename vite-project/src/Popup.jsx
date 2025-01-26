import React from 'react';

function Popup({ message, onClose }) {
    return (
        <div style={popupStyle}>
            <div style={popupContent}>
                <p>{message}</p>
                <button onClick={onClose} style={buttonStyle}>Close</button>
            </div>
        </div>
    );
}

const popupStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
};

const popupContent = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    textAlign: 'center',
};

const buttonStyle = {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
};

export default Popup;
