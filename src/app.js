import express from 'express';

let app = express();

import applyConfig from './config';
import applyRoutes from './routes';

app = applyRoutes(applyConfig(app));

export default app;
