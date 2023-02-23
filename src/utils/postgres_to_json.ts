import { KeyObjectType } from 'crypto';
import { Value } from 'ts-postgres';
import { Result } from 'ts-postgres/dist/src/result';

interface postgJson {
  [key: string]: any;
}

export const postgresToJson = (result: Result<Value>) => {
  const jsonArray = [];
  const columns = result.names;
  const rows = result.rows;

  for (let i = 0; i < rows.length; i++) {
    const object: postgJson = {};
    columns.forEach((element: string | number, index: string | number) => {
      object[element] = rows[i][index];
    });
    jsonArray.push(object);
  }

  // console.log(jsonArray);

  return jsonArray;
};
