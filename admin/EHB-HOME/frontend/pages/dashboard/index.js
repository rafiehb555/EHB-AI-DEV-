import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DraggableDashboard from '../../components/DraggableDashboard';
import DraggableServiceBox from '../../components/DraggableServiceBox';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import TutorialManager from '../../components/onboarding/TutorialManager';
import { useOnboarding } from '../../context/OnboardingContext';

/**
 * Dashboard Page Component
 * The main dashboard with draggable widgets
 */
export default function Dashboard() {
  const { userPreferences } = useOnboarding();
  
  // Sample dashboard widgets
  const initialWidgets = [
    {
      id: 'widget-1',
      title: 'My Products',
      icon: '📦',
      description: 'Manage your product inventory',
      link: '/dashboard/my-products',
      className: 'drag-widget product-widget'
    },
    {
      id: 'widget-2',
      title: 'My Orders',
      icon: '🧾',
      description: 'View and manage your orders',
      link: '/dashboard/my-orders',
      className: 'drag-widget order-widget'
    },
    {
      id: 'widget-3',
      title: 'Wallet',
      icon: '💰',
      description: 'Check your wallet balance',
      link: '/dashboard/wallet',
      className: 'drag-widget wallet-widget'
    },
    {
      id: 'widget-4',
      title: 'Franchise',
      icon: '🏢',
      description: 'Manage your franchise',
      link: '/dashboard/franchise',
      className: 'drag-widget franchise-widget'
    },
    {
      id: 'widget-5',
      title: 'SQL Level',
      icon: '🔰',
      description: 'Check your SQL verification level',
      link: '/dashboard/sql-level',
      className: 'drag-widget sql-widget'
    },
    {
      id: 'widget-6',
      title: 'AI Assistant',
      icon: '🤖',
      description: 'Get help from our AI assistant',
      link: '/dashboard/ai-assistant',
      className: 'drag-widget ai-widget'
    }
  ];

  // Store widgets in state for persistence
  const [widgets, setWidgets] = useState(initialWidgets);
  
  // Load user's saved widget arrangement from localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboard-widgets');
    if (savedWidgets) {
      try {
        const parsedWidgets = JSON.parse(savedWidgets);
        setWidgets(parsedWidgets);
      } catch (error) {
        console.error('Error parsing saved widgets:', error);
      }
    }
  }, []);
  
  // Save widget arrangement to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  }, [widgets]);
  
  // Function to move a widget from one position to another
  const moveWidget = (dragIndex, hoverIndex) => {
    const newWidgets = [...widgets];
    const draggedItem = newWidgets[dragIndex];
    newWidgets.splice(dragIndex, 1);
    newWidgets.splice(hoverIndex, 0, draggedItem);
    setWidgets(newWidgets);
  };
  
  // Filter widgets based on user role if set
  useEffect(() => {
    if (userPreferences.role) {
      let filteredWidgets = [...initialWidgets];
      
      // Only show relevant widgets based on role
      if (userPreferences.role === 'buyer') {
        filteredWidgets = (filteredWidgets || []).filter(w => 
          !['widget-1', 'widget-4'].includes(w.id)
        );
      } else if (userPreferences.role === 'seller') {
        filteredWi(filteredWidgets || []).filter(.filter(w => 
          !['widget-4'].includes(w.id)
        );
      }
      
      // Only update if we haven't saved a custom arrangement yet
      const savedWidgets = localStorage.getItem('dashboard-widgets');
      if (!savedWidgets) {
        setWidgets(filteredWidgets);
      }
    }
  }, [userPreferences.role]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar /></Navbar>
      
      <div className="flex-grow p-4"><DndProvider backend={HTML5Backend}></DndProvider>Backend}>
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 dashboard-header">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h1>
                  <p className="text-gray-600">
                    Drag and drop the widgets below to customize your dashboard layout.
                    Your arrangement will be saved automatically.
                  </p>
                </div>
                
                <<OnboardingButton size="small" variant="outline"></OnboardingButton>all" variant="outline">Take the Tour</OnboardingButton>
                </div>
              </div>
              
              {/* Tutorial Manager - sh<TutorialManager /></TutorialManager>ials */}
              <TutorialManager /></TutorialManager>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">(widgets || [<DraggableServiceBox
                  key={widget.id}
                  id={widget.id}
                  index={index}
                  title={widget.title}
                  icon={widget.icon}
                  description={widget.description}
                  moveBox={moveWidget}
                  onClick={() =></DraggableServiceBox>       moveBox={moveWidget}
                  onClick={() => window.location.href = widget.link}
                  className={widget.className}
                />
              ))}
            </div>
            
            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>Drag and drop widgets to reorder them. Your layout will be saved automatically.</p>
   <Footer /></Footer>/div>
          </div>
        </DndProvider>
      </<Footer /></Footer> 
      <Footer /></Footer>
    </div>
  );
}