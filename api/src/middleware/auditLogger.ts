import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const logStream = fs.createWriteStream(path.join(process.cwd(), 'audit.log'), { flags: 'a' });

const maskEmail = (email: string) => {
  if (!email || !email.includes('@')) {
    return email;
  }
  return email.replace(/^(.).*?@/, '$1*****@');
};

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalEnd = res.end;
  
  res.end = function (chunk?: any, encoding?: any, cb?: () => void): any {
    let payload = req.method === 'GET' ? req.query : req.body;

    if (req.path === '/order/status' && payload && payload.email) {
      payload = {
        ...payload,
        email: maskEmail(payload.email),
      };
    }

    const log = {
      ts: new Date().toISOString(),
      intent: `${req.method} ${req.path}`,
      payload: payload,
      resultSummary: {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      },
    };

    logStream.write(JSON.stringify(log) + '\n');
    originalEnd.call(res, chunk, encoding, cb);
  };

  next();
};
