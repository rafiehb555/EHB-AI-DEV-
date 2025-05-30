import React from 'react';

/**
 * Badge component that displays an unread notification count
 * 
 * @param {Object} props
 * @param {number} props.count - The number of unread notifications
 * @param {boolean} props.showZero - Whether to show the badge when count is zero
 */
const NotificationBadge = ({ count, showZero = false }) => {
  // If count is zero and we don't want to show zeros, don't render anything
  if (count === 0 && !showZero) {
    return null;
  }

  return (
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '20px',
        height: '20px',
        padding: '0 6px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#ef4444', // Red color
        borderRadius: '10px',
        position: 'absolute',
        top: '-5px',
        right: '-5px',
      }}
    >
      {count}
    </span>
  );
};

export default NotificationBadge;