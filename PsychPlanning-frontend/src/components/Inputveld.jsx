import { FormControl, Input, FormLabel, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

const Inputveld = ({ label, naam, type, validatieregels, required, placeholder, id, ...rest }) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const hasError = naam in errors;

  return (
    <FormControl mb={4} isRequired={required}>
      <FormLabel>{label}</FormLabel>
      <Input
        {...register(naam, validatieregels)}
        type={type}
        name={naam}
        placeholder={`Voer je ${placeholder ? placeholder : naam} in`}
        disabled={isSubmitting}
        id={id}
        {...rest}
      />
      {hasError ? (<Text>{errors[naam].message}</Text>) : null}
    </FormControl>
  );
};

export default Inputveld;