import 'dotenv/config';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './src/typeorm.config';

export default new DataSource(typeOrmConfig);


