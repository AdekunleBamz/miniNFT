import { useState } from 'react';

const Tabs = ({ tabs = [], defaultTab = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index, tabs[index]);
    }
  };
  
  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${index}`}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabChange(index)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>
      
      <div className="tabs-panels">
        {tabs.map((tab, index) => (
          <div
            key={index}
            id={`tabpanel-${index}`}
            role="tabpanel"
            hidden={activeTab !== index}
            className="tab-panel"
          >
            {activeTab === index && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export const VerticalTabs = ({ tabs = [], defaultTab = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index, tabs[index]);
    }
  };
  
  return (
    <div className="tabs vertical">
      <div className="tabs-list" role="tablist" aria-orientation="vertical">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeTab === index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabChange(index)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="tabs-panels">
        {tabs.map((tab, index) => (
          <div
            key={index}
            role="tabpanel"
            hidden={activeTab !== index}
            className="tab-panel"
          >
            {activeTab === index && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
