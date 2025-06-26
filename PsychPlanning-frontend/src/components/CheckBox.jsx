import { FormControl, Text, Checkbox } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

const CheckBox = ({ naam, tekst, required, ...rest }) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const hasError = naam in errors;

  return (
    <FormControl mb={4} isRequired={required}>
      <Checkbox
        {...register(naam)}
        name={naam}
        disabled={isSubmitting}
        {...rest}
      >
        {tekst}
      </Checkbox>
      {hasError ? (<Text>{errors[naam].message}</Text>) : null}
    </FormControl>
  );
};

export default CheckBox;