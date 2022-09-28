import { Client } from 'ts-postgres';

class Database {
  public client: Client;

  constructor() {
    this.client = new Client({
      user: 'postgres',
      password: 'admin',
      host: 'localhost',
      database: 'new_development_db',
      port: 5432,
    });
    this.client.connect();
  }
}

export const database: Database = new Database();
