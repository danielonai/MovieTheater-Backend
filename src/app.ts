import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import movies from './api/movies';
import seats from './api/seats';
import auth from './api/auth';
import booking from './api/booking';
import screenings from './api/screenings';

import * as middlewares from './middlewares';
import { authMiddleware } from './middlewares';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', auth);
app.use('/api/v1/', authMiddleware, booking);
app.use('/api/v1/movies', authMiddleware, movies);
app.use('/api/v1/seats', authMiddleware, seats);
app.use('/api/v1/screenings', authMiddleware, screenings);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


export default app;