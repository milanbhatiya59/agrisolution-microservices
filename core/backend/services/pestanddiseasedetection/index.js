import dotenv from 'dotenv';
dotenv.config({ path: './../../.env' });

import { app } from './app.js';
import { PORT } from '../../constants.js';
import connectDB from '../../db/index.js'

connectDB()
  .then(() => {
    app.listen(PORT || 80, () => {
      console.log(`⚙️ Server is running at : http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log('Database connection failed !!! ', err);
  });
