import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
    namespace Multer {
      interface File extends Multerfile {}
    }
  }
}
