import React from 'react'
import Card from '../Card'

interface InputModeSelectorProps {
  selectedMode: 'manual' | 'ocr'
  onModeChange: (mode: 'manual' | 'ocr') => void
}

const InputModeSelector: React.FC<InputModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  return (
    <div className="space-y-6 mb-8">
      {/* OCR ввод - приоритетный вариант */}
      <Card 
        hover={true}
        className={`
          cursor-pointer transition-all
          ${selectedMode === 'ocr' 
            ? 'border-black border-2 bg-gray-50' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
        onClick={() => onModeChange('ocr')}
      >
        <div className="flex flex-col items-center text-center py-6">
          <div className="mb-4">
            <svg 
              className="w-12 h-12 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ввод с отсканированного документа
          </h3>
          <p className="text-sm text-gray-600">
            Загрузите документ для автоматического заполнения
          </p>
        </div>
      </Card>

      {/* Разделитель "или" */}
      <div className="flex items-center justify-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm font-medium text-gray-500">или</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Ручной ввод - простая кнопка */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onModeChange('manual')}
          className={`
            px-6 py-3 text-base font-medium rounded-lg transition-all
            ${selectedMode === 'manual'
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          Ручной ввод данных
        </button>
      </div>
    </div>
  )
}

export default InputModeSelector

