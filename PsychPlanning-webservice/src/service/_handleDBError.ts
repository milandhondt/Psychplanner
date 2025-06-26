import ServiceError from '../core/serviceError';

const handleDBError = (error: any) => {
  const { code = '', message } = error;

  if (code === 'P2002') {
    switch (true) {
      case message.includes('idx_user_email_unique'):
        throw ServiceError.validationFailed(
          'There is already a user with this email address',
        );
      default:
        throw ServiceError.validationFailed('This item already exists');
    }
  }

  if (code === 'P2025') {
    switch (true) {
      case message.includes('fk_services_psycholoog'):
        throw ServiceError.notFound('This psycholoog does not exist');
      case message.includes('fk_beschikbaarheden_psycholoog'):
        throw ServiceError.notFound('This psycholoog does not exist');
      case message.includes('psycholoog'):
        throw ServiceError.notFound('No psycholoog with this id exists');
      case message.includes('klant'):
        throw ServiceError.notFound('No klant with this id exists');
      case message.includes('service'):
        throw ServiceError.notFound('No service with this id exists');
      case message.includes('afspraak'):
        throw ServiceError.notFound('No afspraak with this id exists');
      case message.includes('beschikbaarheid'):
        throw ServiceError.notFound('No beschikbaarheid with this id exists');
    }
  }

  if (code === 'P2003') {
    switch (true) {
      case message.includes('service_id'):
        throw ServiceError.conflict(
          'This service does not exist or is still linked.',
        );
      case message.includes('psycholoog_id'):
        throw ServiceError.conflict(
          'This psycholoog does not exist or is still linked.',
        );
      case message.includes('klant_id'):
        throw ServiceError.conflict(
          'This klant does not exist or is still linked.',
        );
      case message.includes('user_id'):
        throw ServiceError.conflict(
          'This user does not exist or is still linked.',
        );
      case message.includes('beschikbaarheid_id'):
        throw ServiceError.conflict(
          'This beschikbaarheid does not exist or is still linked.',
        );
    }
  }

  throw error;
};

export default handleDBError;
