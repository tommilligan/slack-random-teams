import bodyParser from 'body-parser';

const applyConfig = app => {
  // for parsing application/json
  app.use(bodyParser.json());
  // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  return app;
};

export default applyConfig;