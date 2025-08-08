import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface ValidationState {
  errors: ValidationErrors;
  isValid: boolean;
  touched: { [key: string]: boolean };
}

export function useValidation() {
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: {},
    isValid: true,
    touched: {}
  });

  const validateField = useCallback((value: any, rules: ValidationRule, fieldName: string): string | null => {
    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${fieldName} is required`;
    }

    if (!value || value.toString().trim() === '') {
      return null; // Skip other validations if field is empty and not required
    }

    // Min length validation
    if (rules.minLength && value.toString().length < rules.minLength) {
      return `${fieldName} must be at least ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && value.toString().length > rules.maxLength) {
      return `${fieldName} must be no more than ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value.toString())) {
      return `${fieldName} format is invalid`;
    }

    // Custom validation
    if (rules.custom) {
      const result = rules.custom(value);
      if (typeof result === 'string') {
        return result;
      }
      if (!result) {
        return `${fieldName} is invalid`;
      }
    }

    return null;
  }, []);

  const validateForm = useCallback((data: any, validationRules: { [key: string]: ValidationRule }): ValidationErrors => {
    const errors: ValidationErrors = {};

    Object.keys(validationRules).forEach(fieldName => {
      const value = data[fieldName];
      const rules = validationRules[fieldName];
      const error = validateField(value, rules, fieldName);
      
      if (error) {
        errors[fieldName] = error;
      }
    });

    return errors;
  }, [validateField]);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setValidationState(prev => ({
      ...prev,
      errors: { ...prev.errors, [fieldName]: error },
      isValid: false
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setValidationState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[fieldName];
      
      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0
      };
    });
  }, []);

  const setFieldTouched = useCallback((fieldName: string, touched: boolean = true) => {
    setValidationState(prev => ({
      ...prev,
      touched: { ...prev.touched, [fieldName]: touched }
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationState(prev => ({
      ...prev,
      errors: {},
      isValid: true
    }));
  }, []);

  const validateAndSetErrors = useCallback((data: any, validationRules: { [key: string]: ValidationRule }) => {
    const errors = validateForm(data, validationRules);
    setValidationState(prev => ({
      ...prev,
      errors,
      isValid: Object.keys(errors).length === 0
    }));
    return errors;
  }, [validateForm]);

  return {
    ...validationState,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    clearAllErrors,
    validateAndSetErrors
  };
} 