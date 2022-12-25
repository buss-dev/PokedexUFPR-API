import { Request, Response } from 'express';
import { database } from '../database-pg';

interface account {
  account_number: number;
  account_agency: number;
  account_type: number;
  account_owner: number;
}

class Account {
  public async newAccount(req: Request, res: Response) {
    const account: account = {
      account_number: req.body.accountNumber,
      account_agency: req.body.agencyNumber,
      account_type: req.body.typeId,
      account_owner: req.body.ownerId,
    };

    const result = await database.client.query(
      `
    INSERT into account (account_number, account_agency, account_type, account_owner)
    VALUES ($1, $2, $3, $4)
    `,
      [
        account.account_number,
        account.account_agency,
        account.account_type,
        account.account_owner,
      ]
    );

    return res.json({
      account: account,
      message: 'Account created!',
    });
  }

  public async getAccountByOwnerId(req: Request, res: Response) {
    try {
      const result = await database.client.query(
        `
        select concat_ws(' ',person.person_first_name, person.person_last_name) as name, account_type.account_type_name, account.account_number, account.account_agency from person
        join account ON account.account_owner = person.person_id
        join account_type ON account_type.account_type_id = account.account_type
        where person.person_id = $1
        `,
        [req.body.person_id]
      );
      const account: {} = {
        ownerName: result.rows[0][0],
        accountType: result.rows[0][1],
        accountNumber: result.rows[0][2],
        agencyNumber: result.rows[0][3],
      };

      res.json({
        account: account,
      });
    } catch (err) {
      let message = 'Unknown error';
      if (err instanceof Error) message = err.message;

      if (message === "Cannot read property '0' of undefined") {
        res.json({ error: `No account available for this id` });
      }

      res.send(message);
    }
  }

  public async deleteAccountByIdAndAgency(req: Request, res: Response) {
    const result = await database.client.query(
      `
      DELETE FROM account
      WHERE account_number = $1 AND account_agency = $2
      `,
      [req.body.accountNumber, req.body.accountAgency]
    );
    res.json(
      `Account ${req.body.accountNumber} from agency ${req.body.accountAgency} deleted succesfully!`
    );
  }
}

export const account: Account = new Account();
