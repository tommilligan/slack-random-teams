import bodyParser from 'body-parser';
import morgan from 'morgan';

const applyConfig = app => {
  // for parsing application/json
  app.use(bodyParser.json());
  // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  // logging
  app.use(morgan('combined'));
  return app;
};

export default applyConfig;