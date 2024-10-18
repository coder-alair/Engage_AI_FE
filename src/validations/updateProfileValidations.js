import validator from 'validator';

export function editPersonalValidation(data) {
  const errors = [];

  // Regular expression to allow only letters and spaces
  const nameRegex = /^[A-Za-z\s]+$/;

  if (!validator.isLength(data.firstName?.trim(), { min: 1 })) {
    errors.push('Please enter the first name.');
  } else if (!nameRegex.test(data.firstName?.trim())) {
    errors.push('First name should contain only letters and spaces.');
  }

  if (!validator.isLength(data.lastName?.trim(), { min: 1 })) {
    errors.push('Please enter the last name.');

  } else if (!nameRegex.test(data.lastName?.trim())) {
    errors.push('Last name should contain only letters and spaces.');
  }

  if (validator.isEmpty(data.email.trim())) {
    errors.push('Please enter the email address.');

  } else if (!validator.isEmail(data.email)) {
    errors.push('Please enter a valid email address.');
  }
  if (data.password || data.confirmPassword) {
    if ((!data.password || !data.confirmPassword)) {
      errors.push('Please enter both password and confirm password.');
    } else if (data.password && data.confirmPassword) {
      if (data.password !== data.confirmPassword) {
        errors.push('Please enter same password for both password field.');
      }
    }
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

