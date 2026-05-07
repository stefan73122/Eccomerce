import { cn } from '@/lib/cn';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  (isCompleted || isActive) &&
                    'bg-[var(--primary)] text-white',
                  isUpcoming && 'bg-gray-200 text-gray-500'
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  'text-xs mt-1',
                  isActive && 'font-medium text-[var(--text-dark)]',
                  isCompleted && 'text-[var(--text-dark)]',
                  isUpcoming && 'text-gray-500'
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-16 h-0.5 mx-2',
                  index < currentStep
                    ? 'bg-[var(--primary)]'
                    : 'bg-gray-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
