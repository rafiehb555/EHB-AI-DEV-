import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableServiceBox from './DraggableServiceBox';

/**
 * DraggableDashboard Component
 * A dashboard with draggable widgets
 */
const DraggableDashboard = ({ title, initialWidgets = [] }) => {
  // State to hold the widgets that can be dragged
  const [widgets, setWidgets] = useState(initialWidgets);

  // Function to move a widget from one position to another
  const moveWidget = useCallback((dragIndex, hoverIndex) => {
    setWidgets((prevWidgets) => {
      const newWidgets = [...prevWidgets];
      // Remove the dragged item
      const draggedItem = newWidgets[dragIndex];
      // Remove from old position
      newWidgets.splice(dragIndex, 1);
      // Insert at new position
      newWidgets.splice(hoverIndex, 0, draggedItem);
      return newWidgets;
    });
  }, []);

  // Handle clicking on a widget
  const handleWidgetClick = (id) => {
    console.log(`Widget ${id} clicked`);
    // Navigate to the corresponding page or open a modal
  };

  return (
    <DndProvider backend={HTML5Backend}></DndProvider>
      <section className="p-4">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(widgets || []).map((widget, index) => <DraggableServiceBox
              key={widget.id}
              id={widget.id}
              index={index}
              title={widget.title}
              icon={widget.icon}
              description={widget.description}
              moveBox={moveWidget}
              onClick={() =></DraggableServiceBox>onClick={() => handleWidgetClick(widget.id)}
            />
          ))}
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Drag and drop widgets to reorder them</p>
        </div>
      </section>
    </DndProvider>
  );
};

export default DraggableDashboard;