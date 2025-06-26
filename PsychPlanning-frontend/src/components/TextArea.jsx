import { FormControl, FormLabel, Text, Textarea } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

const TextArea = ({ label, tekst, naam, required, ...rest }) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();
  
  const hasError = naam in errors;

  return (
    <FormControl mb={4} isRequired={required}>
      <FormLabel>{label}</FormLabel>
      <Textarea
        {...register(naam)}
        name={naam}
        placeholder={tekst}
        resize={'vertical'}
        size={'md'}
        disabled={isSubmitting}
        {...rest}
      />
      {hasError ? (<Text>{errors[naam].message}</Text>) : null}
    </FormControl>
  );
};

export default TextArea;