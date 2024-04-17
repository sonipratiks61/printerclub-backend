
const express = require('express');
const app=express();

const { sequelize } = require('./models');
const bodyParser = require('body-parser');

const cors=require('cors')
const DEFAULT_PORT = 3000;
const dotenv = require('dotenv');
const helmet = require('helmet');


const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

const authRoute=require('./routes/authRoute');
const productRoute=require('./routes/productRoute')
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!!! shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});


app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json({
  limit:"15kb"
}));


app.use(express.urlencoded({ extended: true }));
app.use('/',authRoute);
app.use('/',productRoute)
app.listen({ port: process.env.PORT || DEFAULT_PORT }, async () => {
  console.log('Server is working on port:', process.env.PORT || DEFAULT_PORT);
  try {
    await sequelize.authenticate();
    console.log('Database Connected!');

    const env = process.env.NODE_ENV || 'development';
    if (env.trim() === 'development') {
      await sequelize.sync({ alter: false });
    }

    console.log(
      'All models were synchronized successfully. \n\r *** Happy Coding !! ***',
    );
  } catch (error) {
    console.log('Error while connecting DB', error);
  }
});