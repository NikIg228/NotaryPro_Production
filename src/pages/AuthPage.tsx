import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import PasswordInput from '../components/PasswordInput'

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    licenseNumber: '',
    licenseDate: '',
    licenseIssuer: '',
    phone: '',
    email: '',
    city: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Пароль должен содержать не менее 6 символов'
    }
    if (!/\d/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру'
    }
    if (!/[a-zA-Zа-яА-Я]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну букву'
    }
    return null
  }

  const validateEmail = (email: string): string | null => {
    if (!email) {
      return 'Email обязателен для заполнения'
    }
    // Регулярное выражение для проверки email
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
    // Удаляем все нецифровые символы для проверки
    const digitsOnly = phone.replace(/\D/g, '')
    
    // Проверяем, что есть хотя бы некоторые цифры
    if (digitsOnly.length === 0) {
      return 'Введите номер телефона'
    }
    
    // Для казахстанских номеров: может быть +7XXXXXXXXXX (11 цифр) или 8XXXXXXXXXX (11 цифр) или XXXXXXXXXX (10 цифр)
    // Также поддерживаем международные форматы (от 10 до 15 цифр)
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return 'Введите корректный номер телефона (от 10 до 15 цифр)'
    }
    
    // Если номер начинается с 7 или 8 и имеет 11 цифр - это казахстанский формат
    if (digitsOnly.length === 11) {
      if (!digitsOnly.startsWith('7') && !digitsOnly.startsWith('8')) {
        return 'Введите корректный номер телефона'
      }
    }
    
    // Если номер имеет 10 цифр - это может быть локальный формат без кода страны
    if (digitsOnly.length === 10 && !digitsOnly.startsWith('7') && !digitsOnly.startsWith('8')) {
      // Это нормально для локальных номеров
    }
    
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: { [key: string]: string } = {}

    // Валидация email
    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
    }

    // Валидация телефона
    const phoneError = validatePhone(formData.phone)
    if (phoneError) {
      newErrors.phone = phoneError
    }

    // Валидация пароля
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
    }

    // Валидация подтверждения пароля
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    setErrors(newErrors)

    // Если есть ошибки, не отправляем форму
    if (Object.keys(newErrors).length > 0) {
      return
    }

    // Здесь будет логика регистрации
    console.log('Registration data:', formData)
    // После регистрации можно перенаправить на главную страницу
    navigate('/')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    const newErrors = { ...errors }
    
    // Валидация email при вводе
    if (field === 'email') {
      const emailError = validateEmail(value)
      if (emailError) {
        newErrors.email = emailError
      } else {
        delete newErrors.email
      }
    }
    
    // Валидация телефона при вводе
    if (field === 'phone') {
      const phoneError = validatePhone(value)
      if (phoneError) {
        newErrors.phone = phoneError
      } else {
        delete newErrors.phone
      }
    }
    
    // Валидация пароля при вводе
    if (field === 'password') {
      const passwordError = validatePassword(value)
      if (passwordError) {
        newErrors.password = passwordError
      } else {
        delete newErrors.password
      }
      
      // Проверяем совпадение с подтверждением пароля
      if (formData.confirmPassword) {
        if (value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Пароли не совпадают'
        } else {
          delete newErrors.confirmPassword
        }
      }
    }
    
    // Валидация подтверждения пароля
    if (field === 'confirmPassword') {
      if (value !== formData.password) {
        newErrors.confirmPassword = 'Пароли не совпадают'
      } else {
        delete newErrors.confirmPassword
      }
    }
    
    // Очищаем ошибку для других полей при изменении
    if (!['email', 'phone', 'password', 'confirmPassword'].includes(field) && newErrors[field]) {
      delete newErrors[field]
    }
    
    setErrors(newErrors)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Получите бесплатный доступ на 7 дней
        </h2>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Регистрация занимает менее 1 минуты.
        </p>

        {/* Информационное сообщение */}
        <div className="mb-8 bg-blue-100 border-2 border-blue-400 rounded-lg p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-800 leading-relaxed">
              Данные нотариуса используются только для автоматического заполнения удостоверительных надписей и других реквизитов в документах. Это необходимо для точности и корректной работы сервиса.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
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
          <PasswordInput
            label="Пароль"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            required
            placeholder="Минимум 6 символов, цифры и буквы"
          />
          <PasswordInput
            label="Подтверждение пароля"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
            placeholder="Повторите пароль"
          />
          <Button type="submit" className="w-full text-lg py-4">
            Создать аккаунт
          </Button>
          <p className="text-sm text-gray-500 text-center mt-4">
            Регистрация бесплатная. Банковские реквизиты не требуются.
          </p>
        </form>
      </div>

      {/* Футер */}
      <footer className="bg-gray-900 text-white py-12 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img 
                src="/logo_transparent.png" 
                alt="NotaryPro.kz" 
                className="h-[120px] w-auto mb-4"
              />
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты поддержки</h4>
              <p className="text-gray-400">Email: support@notarypro.kz</p>
              <p className="text-gray-400">Телефон: +7 (XXX) XXX-XX-XX</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Документы</h4>
              <a href="#" className="block text-gray-400 hover:text-white mb-2">Политика конфиденциальности</a>
              <a href="#" className="block text-gray-400 hover:text-white">Договор-оферта</a>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <a href="#" className="block text-gray-400 hover:text-white">WhatsApp-поддержка</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NotaryPro.kz. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AuthPage

