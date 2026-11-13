export default {
  define: {
    BASE_API: process.env.MOCK === 'true'
      ? '/mock'
      : process.env.API_BASE || 'http://127.0.0.1:8080/admin',
  },
};
