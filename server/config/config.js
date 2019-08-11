import dotenv from 'dotenv';

dotenv.config();

const DB_URL = process.env.NODE_ENV === 'development' ? process.env.DB_URL : process.env.DB_TEST_CON;

export default DB_URL;
