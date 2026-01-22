import { useState } from 'react';

/**
 * Tab container component
 */
export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  className = ''
}) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id);
  const currentTab = activeTab !== undefined ? activeTab : internalActive;
  const handleChange = onChange || setInternalActive;

  return (
    <div className={`tabs tabs--${variant} tabs--${size} ${fullWidth ? 'tabs--full-width' : ''} ${className}`}>
      <div className="tabs__list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleChange(tab.id)}
            className={`tabs__tab ${currentTab === tab.id ? 'tabs__tab--active' : ''} ${
              tab.disabled ? 'tabs__tab--disabled' : ''
            }`}
            role="tab"
            aria-selected={currentTab === tab.id}
            aria-disabled={tab.disabled}
            tabIndex={currentTab === tab.id ? 0 : -1}
          >
            {tab.icon && <span className="tabs__icon">{tab.icon}</span>}
            <span className="tabs__label">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="tabs__badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
      <div className="tabs__indicator" />
    </div>
  );
}

/**
 * Tab panel component
 */
export function TabPanel({
  children,
  id,
  activeTab,
  lazy = false,
  keepMounted = true,
  className = ''
}) {
  const isActive = id === activeTab;

  if (lazy && !isActive && !keepMounted) {
    return null;
  }

  return (
    <div
      className={`tab-panel ${isActive ? 'tab-panel--active' : ''} ${className}`}
      role="tabpanel"
      aria-hidden={!isActive}
      style={{ display: isActive ? 'block' : 'none' }}
    >
      {(isActive || keepMounted) && children}
    </div>
  );
}

/**
 * Complete tabs with panels
 */
export function TabsWithPanels({
  tabs = [],
  defaultTab,
  activeTab: controlledTab,
  onChange,
  lazy = false,
  keepMounted = true,
  variant = 'default',
  className = ''
}) {
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const handleChange = onChange || setInternalTab;

  return (
    <div className={`tabs-container ${className}`}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={handleChange}
        variant={variant}
      />
      <div className="tabs-container__panels">
        {tabs.map((tab) => (
          <TabPanel
            key={tab.id}
            id={tab.id}
            activeTab={activeTab}
            lazy={lazy}
            keepMounted={keepMounted}
          >
            {tab.content}
          </TabPanel>
        ))}
      </div>
    </div>
  );
}

/**
 * Accordion component
 */
export function Accordion({
  items = [],
  allowMultiple = false,
  defaultOpen = [],
  className = ''
}) {
  const [openItems, setOpenItems] = useState(defaultOpen);

  const toggleItem = (id) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(id)
          ? prev.filter(i => i !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(id) ? [] : [id]
      );
    }
  };

  return (
    <div className={`accordion ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        
        return (
          <div
            key={item.id}
            className={`accordion__item ${isOpen ? 'accordion__item--open' : ''} ${
              item.disabled ? 'accordion__item--disabled' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => !item.disabled && toggleItem(item.id)}
              className="accordion__header"
              aria-expanded={isOpen}
              disabled={item.disabled}
            >
              {item.icon && <span className="accordion__icon">{item.icon}</span>}
              <span className="accordion__title">{item.title}</span>
              {item.subtitle && (
                <span className="accordion__subtitle">{item.subtitle}</span>
              )}
              <span className={`accordion__arrow ${isOpen ? 'accordion__arrow--up' : ''}`}>
                ▼
              </span>
            </button>
            <div
              className="accordion__content"
              style={{
                maxHeight: isOpen ? '1000px' : '0',
                opacity: isOpen ? 1 : 0
              }}
            >
              <div className="accordion__body">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Single accordion item
 */
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  icon,
  disabled = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`accordion-item ${isOpen ? 'accordion-item--open' : ''} ${
      disabled ? 'accordion-item--disabled' : ''
    } ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="accordion-item__header"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        {icon && <span className="accordion-item__icon">{icon}</span>}
        <span className="accordion-item__title">{title}</span>
        <span className={`accordion-item__arrow ${isOpen ? 'accordion-item__arrow--up' : ''}`}>
          ▼
        </span>
      </button>
      <div
        className="accordion-item__content"
        style={{
          maxHeight: isOpen ? '1000px' : '0',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="accordion-item__body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Tabs;
