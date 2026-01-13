import { useState } from 'react';

export function useFormValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';

    if (rule.required && !value) {
      return `${name} is required`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `${name} must be at most ${rule.maxLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${name} is invalid`;
    }

    if (rule.min && parseFloat(value) < rule.min) {
      return `${name} must be at least ${rule.min}`;
    }

    if (rule.max && parseFloat(value) > rule.max) {
      return `${name} must be at most ${rule.max}`;
    }

    if (rule.custom && typeof rule.custom === 'function') {
      const customError = rule.custom(value);
      if (customError) return customError;
    }

    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validate(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validate(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (onSubmit) => {
    return (e) => {
      e.preventDefault();
      
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      const newErrors = {};
      Object.keys(values).forEach((key) => {
        const error = validate(key, values[key]);
        if (error) {
          newErrors[key] = error;
        }
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        onSubmit(values);
      }
    };
  };

  const isFormValid = () => {
    return Object.keys(errors).length === 0 && 
           Object.keys(values).every(key => {
             const rule = validationRules[key];
             if (rule?.required && !values[key]) {
               return false;
             }
             return true;
           });
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
    setValues,
    setErrors,
  };
}
