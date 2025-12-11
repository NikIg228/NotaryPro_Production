import React, { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import PasswordInput from '../components/PasswordInput'

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: 'Иванов Иван Иванович',
    licenseNumber: '123456',
    licenseDate: '2020-01-15',
    licenseIssuer: 'Министерство юстиции РК',
    phone: '+7 (700) 123-45-67',
    city: 'Алматы',
    email: 'ivanov@example.com',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validatePassword = (password: string): string | null => {
    if (password && password.length < 6) {
      return 'Пароль должен содержать не менее 6 символов'
    }
    if (password && !/\d/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру'
    }
    if (password && !/[a-zA-Zа-яА-Я]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну букву'
    }
    return null
  }

  const validateEmail = (email: string): string | null => {
    if (!email) {
      return 'Email обязателен для заполнения'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Введите корректный email адрес'
    }
    return null
  }

  const validatePhone = (phone: string): string | null => {
    if (!phone) {
      return 'Телефон обязателен для заполнения'
    }
    const digitsOnly = phone.replace(/\D/g, '')
    if (digitsOnly.length === 0) {
      return 'Введите номер телефона'
    }
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return 'Введите корректный номер телефона (от 10 до 15 цифр)'
    }
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    const newErrors = { ...errors }
    
    if (field === 'email') {
      const emailError = validateEmail(value)
      if (emailError) {
        newErrors.email = emailError
      } else {
        delete newErrors.email
      }
    }
    
    if (field === 'phone') {
      const phoneError = validatePhone(value)
      if (phoneError) {
        newErrors.phone = phoneError
      } else {
        delete newErrors.phone
      }
    }
    
    if (field === 'password') {
      const passwordError = validatePassword(value)
      if (passwordError) {
        newErrors.password = passwordError
      } else {
        delete newErrors.password
      }
      
      if (formData.confirmPassword) {
        if (value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Пароли не совпадают'
        } else {
          delete newErrors.confirmPassword
        }
      }
    }
    
    if (field === 'confirmPassword') {
      if (value !== formData.password) {
        newErrors.confirmPassword = 'Пароли не совпадают'
      } else {
        delete newErrors.confirmPassword
      }
    }
    
    if (!['email', 'phone', 'password', 'confirmPassword'].includes(field) && newErrors[field]) {
      delete newErrors[field]
    }
    
    setErrors(newErrors)
  }

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {}

    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
    }

    const phoneError = validatePhone(formData.phone)
    if (phoneError) {
      newErrors.phone = phoneError
    }

    if (formData.password) {
      const passwordError = validatePassword(formData.password)
      if (passwordError) {
        newErrors.password = passwordError
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    // Здесь будет логика сохранения данных
    console.log('Profile data saved:', formData)
    setIsEditing(false)
    // Очищаем поля паролей после сохранения
    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
  }

  const handleCancel = () => {
    setIsEditing(false)
    setErrors({})
    // Здесь можно восстановить исходные данные
    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Личный кабинет
        </h1>

        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 space-y-6">
          {!isEditing ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Личная информация
                </h2>
                <Button onClick={() => setIsEditing(true)}>
                  Редактировать
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    ФИО
                  </label>
                  <p className="text-gray-900">{formData.fullName}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    № лицензии
                  </label>
                  <p className="text-gray-900">{formData.licenseNumber}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Дата выдачи лицензии
                  </label>
                  <p className="text-gray-900">
                    {formData.licenseDate ? new Date(formData.licenseDate).toLocaleDateString('ru-RU') : '-'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Орган выдавший лицензию
                  </label>
                  <p className="text-gray-900">{formData.licenseIssuer}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Телефон
                  </label>
                  <p className="text-gray-900">{formData.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Город
                  </label>
                  <p className="text-gray-900">{formData.city}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{formData.email}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Редактирование личной информации
                </h2>
              </div>

              <div className="space-y-6">
                <Input
                  type="text"
                  label="ФИО"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
                <Input
                  type="text"
                  label="№ лицензии"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  required
                />
                <Input
                  type="date"
                  label="Дата выдачи лицензии"
                  value={formData.licenseDate}
                  onChange={(e) => handleInputChange('licenseDate', e.target.value)}
                  required
                />
                <Input
                  type="text"
                  label="Орган выдавший лицензию"
                  value={formData.licenseIssuer}
                  onChange={(e) => handleInputChange('licenseIssuer', e.target.value)}
                  required
                />
                <Input
                  type="tel"
                  label="Телефон"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  required
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
                <Input
                  type="text"
                  label="Город"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  required
                  placeholder="example@email.com"
                />

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Изменить пароль
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Оставьте поля пустыми, если не хотите менять пароль
                  </p>
                  <PasswordInput
                    label="Новый пароль"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={errors.password}
                    placeholder="Минимум 6 символов, цифры и буквы"
                  />
                  <PasswordInput
                    label="Подтверждение пароля"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    placeholder="Повторите пароль"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    Сохранить изменения
                  </Button>
                  <Button onClick={handleCancel} variant="secondary" className="flex-1">
                    Отмена
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

