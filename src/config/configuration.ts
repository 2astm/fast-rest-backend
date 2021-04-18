export default () => ({
  serverOptions: {
    port: parseInt(process.env.PORT) || 3000,
  },
  mode: process.env.MODE || 'DEV',
  sqlLogs: process.env.SQL_LOGGIN === 'true',
});
