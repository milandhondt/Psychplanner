export default {
  cors: {
    origins: ['https://frontendweb-2425-milandhondt-frontend.onrender.com'],
  },
  auth: {
    jwt: {
      expirationInterval: 30 * 24 * 60 * 60, // (30 dagen)
    },
  },
};
