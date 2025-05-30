import React from 'react';
import DraggableServiceBox from './DraggableServiceBox';

/**
 * DraggableDashboard Component
 * A dashboard with draggable components
 */
const DraggableDashboard = ({ widgets = [], moveWidget }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(widgets || []).map((widget, index) => (
        <DraggableServiceBox
          key={widget.id}
          id={widget.id}
          index={index}
          title={widget.title}
          icon={widget.icon}
          description={widget.description}
          moveBox={moveWidget}
          onClick={() =></DraggableServiceBox> window.location.href = widget.link}
          className={widget.className}
        />
      ))}
    </div>
  );
};

export default DraggableDashboard;