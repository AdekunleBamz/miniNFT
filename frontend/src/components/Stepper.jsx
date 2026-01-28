/**
 * Stepper/Steps component for multi-step processes
 */
function Stepper({ 
  steps = [], 
  currentStep = 0, 
  orientation = 'horizontal',
  size = 'medium',
  className = '' 
}) {
  return (
    <div className={`stepper stepper-${orientation} stepper-${size} ${className}`}>
      {steps.map((step, index) => {
        const status = index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending';
        return (
          <div key={index} className={`stepper-item stepper-item-${status}`}>
            <div className="stepper-indicator">
              {status === 'completed' ? (
                <svg viewBox="0 0 24 24" className="stepper-check">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                </svg>
              ) : (
                <span className="stepper-number">{index + 1}</span>
              )}
            </div>
            {step.label && (
              <div className="stepper-content">
                <span className="stepper-label">{step.label}</span>
                {step.description && <span className="stepper-description">{step.description}</span>}
              </div>
            )}
            {index < steps.length - 1 && <div className="stepper-connector" />}
          </div>
        );
      })}
    </div>
  );
}

export function Step({ children }) {
  return <>{children}</>;
}

export default Stepper;
