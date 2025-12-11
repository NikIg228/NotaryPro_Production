import React, { useMemo } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldDefinition } from '../../types/WizardTypes'
import Input from '../Input'
import FileUpload from './FileUpload'
import { getDictionaryOptions } from '../../utils/dictionaryLoader'
import { shouldShowField, getNestedError, formatErrorForUser } from '../../utils/validation'

interface FormFieldRendererProps {
  field: FieldDefinition
  formData: any
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({ field, formData }) => {
  const { control, formState: { errors } } = useFormContext()
  const fieldError = getNestedError(errors, field.name)

  const isVisible = shouldShowField(field, formData)
  if (!isVisible) {
    return null
  }

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{
              // ВАЛИДАЦИЯ ВРЕМЕННО ОТКЛЮЧЕНА
              required: false,
              // required: field.min !== undefined && field.min > 0 ? (field.label ? `Поле '${field.label}' обязательно для заполнения` : false) : false,
              // min: field.min !== undefined ? { value: field.min, message: `Минимум: ${field.min}` } : undefined,
              // max: field.max !== undefined ? { value: field.max, message: `Максимум: ${field.max}` } : undefined,
            }}
            render={({ field: formField }) => (
              <Input
                {...formField}
                type={field.type}
                label={field.label}
                required={field.min !== undefined && field.min > 0}
                error={fieldError ? formatErrorForUser(fieldError, field.label) : undefined}
              />
            )}
          />
        )

      case 'file':
        return <FileUpload field={field} />

      case 'multiselect':
        const options = useMemo(() => {
          if (field.dictionary) {
            return getDictionaryOptions(field.dictionary)
          }
          return []
        }, [field.dictionary])

        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {field.label}
                </label>
                <select
                  {...formField}
                  multiple
                  className={`
                    w-full px-4 py-2 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                    text-gray-900 min-h-[120px]
                    ${fieldError ? 'border-red-300' : 'border-gray-200'}
                  `}
                >
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldError && (
                  <p className="mt-1 text-sm text-red-600">
                    {formatErrorForUser(fieldError, field.label)}
                  </p>
                )}
              </div>
            )}
          />
        )

      case 'checkbox':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...formField}
                  checked={formField.value || false}
                  className="mr-3 w-4 h-4 text-black focus:ring-black rounded"
                />
                <span className="text-gray-900">{field.label}</span>
              </label>
            )}
          />
        )

      case 'select':
        const selectOptions = useMemo(() => {
          if (field.options) {
            // Преобразуем массив строк/чисел в объекты, если нужно
            return field.options.map((option: any) => {
              if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
                return {
                  value: option,
                  label: String(option)
                }
              }
              return option
            })
          }
          if (field.dictionary) {
            return getDictionaryOptions(field.dictionary)
          }
          return []
        }, [field.options, field.dictionary])

        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {field.label} {field.min !== undefined && field.min > 0 && <span className="text-red-600">*</span>}
                </label>
                <select
                  {...formField}
                  className={`
                    w-full px-4 py-2 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                    text-gray-900
                    ${fieldError ? 'border-red-300' : 'border-gray-200'}
                  `}
                >
                  <option value="">Выберите...</option>
                  {selectOptions.map((option: any, index: number) => {
                    const optionValue = typeof option === 'object' ? option.value : option
                    const optionLabel = typeof option === 'object' ? option.label : String(option)
                    return (
                      <option key={index} value={String(optionValue)}>
                        {optionLabel}
                      </option>
                    )
                  })}
                </select>
                {fieldError && (
                  <p className="mt-1 text-sm text-red-600">
                    {formatErrorForUser(fieldError, field.label)}
                  </p>
                )}
              </div>
            )}
          />
        )

      case 'radio':
        const radioOptions = useMemo(() => {
          if (field.options) {
            // Преобразуем массив строк/чисел в объекты, если нужно
            return field.options.map((option: any) => {
              if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
                const strValue = String(option)
                let label = strValue
                // Переводы для yes/no
                if (strValue.toLowerCase() === 'yes') label = 'Да'
                else if (strValue.toLowerCase() === 'no') label = 'Нет'
                // Переводы для других значений
                else if (strValue === 'until_divorce') label = 'До развода'
                else if (strValue === 'forever') label = 'Бессрочно'
                else if (strValue === 'until_date') label = 'До указанной даты'
                
                return {
                  value: option,
                  label: label
                }
              }
              return option
            })
          }
          if (field.dictionary) {
            return getDictionaryOptions(field.dictionary)
          }
          return []
        }, [field.options, field.dictionary])

        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {field.label}
                </label>
                <div className="space-y-3">
                  {radioOptions.map((option: any, index: number) => {
                    const optionValue = typeof option === 'object' ? option.value : option
                    const optionLabel = typeof option === 'object' ? option.label : String(option)
                    const isChecked = formField.value === optionValue

                    return (
                      <label
                        key={index}
                        className={`
                          flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                          ${isChecked 
                            ? 'border-gray-400 bg-gray-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          {...formField}
                          value={String(optionValue)}
                          checked={isChecked}
                          onChange={() => formField.onChange(optionValue)}
                          className="mr-3 w-4 h-4 text-black focus:ring-black"
                        />
                        <span className="text-gray-900">{optionLabel}</span>
                      </label>
                    )
                  })}
                </div>
                {fieldError && (
                  <p className="mt-1 text-sm text-red-600">
                    {formatErrorForUser(fieldError, field.label)}
                  </p>
                )}
              </div>
            )}
          />
        )

      case 'textarea':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: false,
            }}
            render={({ field: formField }) => (
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {field.label} {field.min !== undefined && field.min > 0 && <span className="text-red-600">*</span>}
                </label>
                <textarea
                  {...formField}
                  rows={4}
                  className={`
                    w-full px-4 py-2 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                    text-gray-900 placeholder-gray-400 resize-y
                    ${fieldError ? 'border-red-300' : 'border-gray-200'}
                  `}
                  placeholder={field.label}
                />
                {fieldError && (
                  <p className="mt-1 text-sm text-red-600">
                    {formatErrorForUser(fieldError, field.label)}
                  </p>
                )}
              </div>
            )}
          />
        )

      case 'typeahead':
      case 'typeahead-multiselect':
        // Обрабатываем как обычное text поле (автодополнение можно добавить позже)
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <Input
                {...formField}
                type="text"
                label={field.label}
                required={field.min !== undefined && field.min > 0}
                error={fieldError ? formatErrorForUser(fieldError, field.label) : undefined}
                placeholder={field.label}
              />
            )}
          />
        )

      case 'datetime':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <Input
                {...formField}
                type="datetime-local"
                label={field.label}
                required={field.min !== undefined && field.min > 0}
                error={fieldError ? formatErrorForUser(fieldError, field.label) : undefined}
              />
            )}
          />
        )

      case 'auto':
        // Автоматическое поле - показываем как read-only или скрываем
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label}
                </label>
                <input
                  {...formField}
                  type="text"
                  readOnly
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  value={formField.value || ''}
                />
              </div>
            )}
          />
        )

      case 'group':
        // Группа полей - показываем как обычное поле с пометкой
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {field.label}
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Группа полей (массив)
                </p>
                <Input
                  {...formField}
                  type="text"
                  label=""
                  placeholder={`Введите данные для ${field.label}`}
                  error={fieldError ? formatErrorForUser(fieldError, field.label) : undefined}
                />
              </div>
            )}
          />
        )

      case 'checkbox-group':
        // checkbox-group как тип поля - обрабатываем как multiselect
        const checkboxGroupOptions = useMemo(() => {
          if (field.options) {
            return field.options.map((option: any) => {
              if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
                return {
                  value: option,
                  label: String(option)
                }
              }
              return option
            })
          }
          if (field.dictionary) {
            return getDictionaryOptions(field.dictionary)
          }
          return []
        }, [field.options, field.dictionary])

        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {field.label} {field.min !== undefined && field.min > 0 && <span className="text-red-600">*</span>}
                </label>
                <div className="space-y-2">
                  {checkboxGroupOptions.map((option: any, index: number) => {
                    const optionValue = typeof option === 'object' ? option.value : option
                    const optionLabel = typeof option === 'object' ? option.label : String(option)
                    const currentValue = formField.value || []
                    const isChecked = Array.isArray(currentValue) && currentValue.includes(optionValue)

                    return (
                      <label
                        key={index}
                        className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const newValue = Array.isArray(currentValue) ? [...currentValue] : []
                            if (e.target.checked) {
                              if (!newValue.includes(optionValue)) {
                                newValue.push(optionValue)
                              }
                            } else {
                              const index = newValue.indexOf(optionValue)
                              if (index > -1) {
                                newValue.splice(index, 1)
                              }
                            }
                            formField.onChange(newValue)
                          }}
                          className="mr-3 w-4 h-4 text-black focus:ring-black rounded"
                        />
                        <span className="text-gray-900">{optionLabel}</span>
                      </label>
                    )
                  })}
                </div>
                {fieldError && (
                  <p className="mt-1 text-sm text-red-600">
                    {formatErrorForUser(fieldError, field.label)}
                  </p>
                )}
              </div>
            )}
          />
        )

      default:
        return (
          <div className="text-gray-600">
            Тип поля "{field.type}" не поддерживается
          </div>
        )
    }
  }

  return <div>{renderField()}</div>
}

export default FormFieldRenderer

