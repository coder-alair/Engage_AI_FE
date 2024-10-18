import validator from 'validator';

export function editAddressValidation(data) {
  const errors = [];

  const nameRegex = /^[A-Za-z\s]+$/;
  const postalCodeRegex = /^[A-Za-z0-9\s-]+$/;
  const addrRegex = /^[A-Za-z0-9\s,./-]+$/;

  if (!validator.isLength(data.country?.trim(), { min: 1 })) {
    errors.push('Please enter the country.');
  } else if (!nameRegex.test(data.country?.trim())) {
    errors.push('Country should contain only letters and spaces.');
  }

  // if (!validator.isLength(data.state?.trim(), { min: 1 })) {
  //   errors.push('Please enter the state.');
  // } else if (!nameRegex.test(data.state?.trim())) {
  //   errors.push('State should contain only letters and spaces.');
  // }

  if (!validator.isLength(data.city?.trim(), { min: 1 })) {
    errors.push('Please enter the city.');
  } else if (!addrRegex.test(data.city?.trim())) {
    errors.push('City should contain only letters, numbers and spaces.');
  }

  if (!validator.isLength(data.address?.trim(), { min: 1 })) {
    errors.push('Please enter the address.');
  } else if (!addrRegex.test(data.address?.trim())) {
    errors.push('Address should contain only letters, numbers and spaces.');
  }

  if (!validator.isLength(data.province?.trim(), { min: 1 })) {
    errors.push('Please enter the province.');
  } else if (!addrRegex.test(data.province?.trim())) {
    errors.push('Province should contain only letters, numbers and spaces.');
  }

  if (!validator.isLength(data.businessArea?.trim(), { min: 1 })) {
    errors.push('Please enter the business area.');
  } else if (!addrRegex.test(data.businessArea?.trim())) {
    errors.push('Business area should contain only letters, numbers and spaces.');
  }

  if (!validator.isLength(data.postalCode?.trim(), { min: 1 })) {
    errors.push('Please enter the postal code.');
  } else if (!postalCodeRegex.test(data.postalCode?.trim())) {
    errors.push('Postal code should contain only numbers and alphabet only.');
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
