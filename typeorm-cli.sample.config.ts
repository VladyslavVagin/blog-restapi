import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 3232,
    username: 'dvfdsfds',
    password: 'dsfewrew432',
    database: 'sdfdsfdsfdsf',
    entities: ['**/*.entity.js'],
    migrations: ['migrations/*.js'],
})