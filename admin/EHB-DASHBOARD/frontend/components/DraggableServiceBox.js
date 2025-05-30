import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'DASHBOARD_WIDGET';

/**
 * DraggableServiceBox Component
 * A draggable box representing a service or widget on the dashboard
 */
const DraggableServiceBox = ({ 
  id, 
  index, 
  title, 
  icon, 
  description, 
  moveBox, 
  onClick,
  className = '',
}) => {
  const ref = useRef(null);
  
  // Implement drag functionality
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  
  // Implement drop functionality
  const [, drop] = useDrop(() => ({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      moveBox(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  }));
  
  // Combine drag and drop refs
  drag(drop(ref));
  
  return (
    <div
      ref={ref}
      className={`
        border border-gray-200 rounded-lg p-4 bg-white shadow-sm
        hover:shadow-md hover:border-blue-300 transition-all
        cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${className}
      `}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="text-3xl mr-3">{icon}</div>
        <div>
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      
      {/* Drag handle indicator */}
      <div className="flex justify-center mt-3">
        <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default DraggableServiceBox;