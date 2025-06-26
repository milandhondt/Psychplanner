import { useFormContext } from 'react-hook-form';
import { FormControl, FormLabel, Select, Text } from '@chakra-ui/react';

export default function SelectList({
  label, naam, placeholder, items, isRequired, validatieregels, isPsychologenLijst, ...rest
}) {
  const {
    register,
    formState: {
      errors,
      isSubmitting,
    },
  } = useFormContext();

  const hasError = naam in errors;

  return (
    <FormControl mb={4} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Select
        {...register(naam, validatieregels)}
        id={naam}
        disabled={isSubmitting}
        {...rest}
      >
        <option key={'placeholder'} value="" disabled>
          {placeholder}
        </option>
        {
          items.map(
            ({ id, naam }) => (
              <option key={id} value={id}>{isPsychologenLijst ? `Dr. ${naam}` : naam}</option>
            ),
          )
        }
      </Select>
      {hasError ? (
        <Text>
          {errors[naam].message}
        </Text>
      ) : null}
    </FormControl>
  );
}