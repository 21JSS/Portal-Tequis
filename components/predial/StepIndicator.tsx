'use client'

interface Step {
  number: number
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

const STEPS: Step[] = [
  { number: 1, label: 'Búsqueda' },
  { number: 2, label: 'Adeudo' },
  { number: 3, label: 'Periodos' },
  { number: 4, label: 'Pagador' },
  { number: 5, label: 'Confirmación' },
]

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-linear-to-r from-[#c5283d] to-[#e8445a] z-0 transition-all duration-700 ease-out"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isDone    = step.number < currentStep
          const isActive  = step.number === currentStep
          const isPending = step.number > currentStep

          return (
            <div key={step.number} className="flex flex-col items-center gap-2 z-10">
              {/* Circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-500 border-2
                  ${isDone    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30' : ''}
                  ${isActive  ? 'bg-[#c5283d] border-[#c5283d] text-white shadow-md shadow-red-500/30 scale-110' : ''}
                  ${isPending ? 'bg-white border-slate-200 text-slate-400' : ''}
                `}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.number}
              </div>
              {/* Label */}
              <span className={`text-[10px] font-semibold tracking-wide hidden sm:block transition-colors ${isActive ? 'text-[#c5283d]' : isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
