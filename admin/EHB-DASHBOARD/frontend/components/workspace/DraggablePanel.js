import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';

const DraggablePanel = ({
  id,
  title,
  children,
  defaultPosition = { x: 0, y: 0 },
  defaultSize = { width: 300, height: 400 },
  minWidth = 200,
  minHeight = 200,
  resizable = true,
  onPositionChange,
  onSizeChange,
  onClose
}) => {
  const { workspaceSettings, updateSetting } = useWorkspace();
  
  // Get position and size from settings if available
  const panelSettings = workspaceSettings.panels[id] || {};
  
  const [position, setPosition] = useState(() => {
    return panelSettings.position || defaultPosition;
  });
  
  const [size, setSize] = useState(() => {
    return panelSettings.size || defaultSize;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState('');
  
  const panelRef = useRef(null);
  
  // Save position and size to context when they change
  useEffect(() => {
    if (!isDragging && !isResizing) {
      updateSetting(`panels.${id}.position`, position);
      if (onPositionChange) onPositionChange(position);
    }
  }, [id, position, isDragging, isResizing, updateSetting, onPositionChange]);
  
  useEffect(() => {
    if (!isDragging && !isResizing) {
      updateSetting(`panels.${id}.size`, size);
      if (onSizeChange) onSizeChange(size);
    }
  }, [id, size, isDragging, isResizing, updateSetting, onSizeChange]);

  // Handle drag start
  const handleDragStart = (e) => {
    e.preventDefault();
    if (isResizing) return;
    
    // Calculate the offset from the mouse position to the panel's top-left corner
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
  };

  // Handle resize start
  const handleResizeStart = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeDirection(direction);
    setIsResizing(true);
  };

  // Handle mouse move for both dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        // Calculate new position based on mouse position and drag offset
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      } else if (isResizing) {
        const rect = panelRef.current.getBoundingClientRect();
        let newWidth = size.width;
        let newHeight = size.height;
        
        // Resize based on direction
        if (resizeDirection.includes('e')) {
          newWidth = Math.max(minWidth, e.clientX - rect.left);
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(minHeight, e.clientY - rect.top);
        }
        if (resizeDirection.includes('w')) {
          const deltaWidth = rect.left - e.clientX;
          if (size.width + deltaWidth >= minWidth) {
            newWidth = size.width + deltaWidth;
            setPosition(prev => ({ ...prev, x: e.clientX }));
          }
        }
        if (resizeDirection.includes('n')) {
          const deltaHeight = rect.top - e.clientY;
          if (size.height + deltaHeight >= minHeight) {
            newHeight = size.height + deltaHeight;
            setPosition(prev => ({ ...prev, y: e.clientY }));
          }
        }
        
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging, 
    isResizing, 
    dragOffset, 
    resizeDirection, 
    size.width, 
    size.height,
    minWidth,
    minHeight
  ]);

  // Panel style
  const panelStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 10,
    ...(isDragging || isResizing ? { userSelect: 'none' } : {})
  };

  // Resize handle style
  const resizeHandleStyle = (direction) => ({
    position: 'absolute',
    ...(direction.includes('n') && { top: '-3px', cursor: 'ns-resize', height: '6px' }),
    ...(direction.includes('e') && { right: '-3px', cursor: 'ew-resize', width: '6px' }),
    ...(direction.includes('s') && { bottom: '-3px', cursor: 'ns-resize', height: '6px' }),
    ...(direction.includes('w') && { left: '-3px', cursor: 'ew-resize', width: '6px' }),
    ...(direction === 'ne' && { top: '-3px', right: '-3px', cursor: 'nesw-resize', width: '6px', height: '6px' }),
    ...(direction === 'se' && { bottom: '-3px', right: '-3px', cursor: 'nwse-resize', width: '6px', height: '6px' }),
    ...(direction === 'sw' && { bottom: '-3px', left: '-3px', cursor: 'nesw-resize', width: '6px', height: '6px' }),
    ...(direction === 'nw' && { top: '-3px', left: '-3px', cursor: 'nwse-resize', width: '6px', height: '6px' }),
    background: 'transparent',
    zIndex: 20
  });

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className="draggable-panel"
    >
      {/* Panel header */}
      <div
        style={{
          padding: '10px 16px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleDragStart}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{title}</h3>
        
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#6c757d'
            }}
          >
            ×
          </button>
        )}
      </div>
      
      {/* Panel content */}
      <div style={{ padding: '16px', flex: 1, overflow: 'auto' }}>
        {children}
      </div>
      
      {/* Resize handles */}
      {resizable && (
        <>
          <div 
            style={{ ...resizeHandleStyle('n'), left: '0', right: '0' }} 
            onMouseDown={(e) => handleResizeStart(e, 'n')} 
          />
          <div 
            style={{ ...resizeHandleStyle('e'), top: '0', bottom: '0' }} 
            onMouseDown={(e) => handleResizeStart(e, 'e')} 
          />
          <div 
            style={{ ...resizeHandleStyle('s'), left: '0', right: '0' }} 
            onMouseDown={(e) => handleResizeStart(e, 's')} 
          />
          <div 
            style={{ ...resizeHandleStyle('w'), top: '0', bottom: '0' }} 
            onMouseDown={(e) => handleResizeStart(e, 'w')} 
          />
          <div 
            style={resizeHandleStyle('ne')} 
            onMouseDown={(e) => handleResizeStart(e, 'ne')} 
          />
          <div 
            style={resizeHandleStyle('se')} 
            onMouseDown={(e) => handleResizeStart(e, 'se')} 
          />
          <div 
            style={resizeHandleStyle('sw')} 
            onMouseDown={(e) => handleResizeStart(e, 'sw')} 
          />
          <div 
            style={resizeHandleStyle('nw')} 
            onMouseDown={(e) => handleResizeStart(e, 'nw')} 
          />
        </>
      )}
    </div>
  );
};

export default DraggablePanel;