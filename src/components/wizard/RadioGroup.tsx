import React from 'react'
import { StepDefinition } from '../../types/WizardTypes'

interface RadioGroupProps {
  step: StepDefinition
  value: any
  onChange: (value: any) => void
}

const RadioGroup: React.FC<RadioGroupProps> = ({ step, value, onChange }) => {
  const getOptionLabel = (option: any): string => {
    if (typeof option === 'object' && option.label) {
      return option.label
    }
    const strValue = String(option)
    // Переводы для yes/no
    if (strValue.toLowerCase() === 'yes') return 'Да'
    if (strValue.toLowerCase() === 'no') return 'Нет'
    // Переводы для других значений
    if (strValue === 'until_divorce') return 'До развода'
    if (strValue === 'forever') return 'Бессрочно'
    if (strValue === 'until_date') return 'До указанной даты'
    if (strValue === 'prenup') return 'Ещё не в браке (пренуп)'
    if (strValue === 'in_marriage') return 'В браке (составляется в браке)'
    if (strValue === 'divorce') return 'После развода (соглашение о разделе)'
    if (strValue === 'personal') return 'Лично'
    if (strValue === 'poa') return 'По доверенности'
    return strValue
  }

  return (
    <div className="space-y-4">
      {step.options?.map((option, index) => {
        const optionValue = typeof option === 'object' ? option.value : option
        const optionLabel = getOptionLabel(option)
        const isChecked = value === optionValue
        
        return (
          <label
            key={index}
            className={`
              flex items-center p-4 border rounded-lg cursor-pointer transition-colors
              ${isChecked 
                ? 'border-black bg-gray-50' 
                : 'border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              name={step.id}
              value={String(optionValue)}
              checked={isChecked}
              className="mr-3 w-4 h-4 text-black focus:ring-black"
              onChange={() => onChange(optionValue)}
            />
            <span className="text-gray-900 font-medium">{optionLabel}</span>
          </label>
        )
      })}
    </div>
  )
}

export default RadioGroup

