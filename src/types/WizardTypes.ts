// Типы для универсального Wizard на основе JSON-структур из docs_structure.txt

export type StepType = 
  | 'form' 
  | 'radio' 
  | 'number' 
  | 'array' 
  | 'checkbox-group' 
  | 'validation' 
  | 'final' 
  | 'input-mode'
  | 'multiselect'
  | 'dynamic-multi-block'
  | 'bank-selection'

export interface FieldDefinition {
  name: string
  type: 'text' | 'number' | 'date' | 'file' | 'checkbox' | 'multiselect' | 'radio' | 'textarea' | 'select' | 'typeahead' | 'typeahead-multiselect' | 'datetime' | 'auto' | 'group' | 'checkbox-group'
  label: string
  min?: number
  max?: number
  dictionary?: string
  show_if?: string
  options?: RadioOption[] | string[] | number[]
}

export interface ManualField extends FieldDefinition {
  name: string
  type: 'text' | 'number' | 'date' | 'file'
  label: string
}

export interface RadioOption {
  value: string | number | boolean
  label: string
}

export interface CheckboxOption {
  value: string
  label: string
}

export interface StepDefinition {
  id: string
  type: StepType
  title?: string
  label?: string
  input_mode_field?: string
  min?: number
  max?: number
  dynamicCountFrom?: string
  item_label?: string
  fields?: FieldDefinition[]
  manual_fields?: ManualField[]
  options?: RadioOption[] | CheckboxOption[]
  optionsFrom?: string
  select_all?: boolean
  blocks?: { [key: string]: FieldDefinition[] }
  bank_card_template?: {
    fields: FieldDefinition[]
  }
  validation?: {
    min?: number
    max?: number
    required?: string[]
  }
  rules?: string[]
  next?: string | { [key: string]: string } | string[]
  output?: string
}

export interface DocumentSchema {
  id: number
  code: string
  title: string
  category: string
  dev_notes?: string[]
  rules_for_cursor?: string[]
  parsed: {
    steps: StepDefinition[]
    placeholders: string[]
  }
}

export interface WizardFormData {
  [key: string]: any
}

