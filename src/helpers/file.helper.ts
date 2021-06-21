import fs from 'fs';
import path from 'path';
import { Logger } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import * as multer from 'multer';

const logger = new Logger('FileHelper');
export const FileStorage = (destination: string) =>
  multer.diskStorage({
    destination(req, file, cb) {
      const dir = `uploads/${destination}`;
      fs.access(dir, (err) => {
        if (err)
          fs.mkdir(dir, { recursive: true }, (err, dir) => {
            logger.debug(`Created dir: ${dir}`);
            cb(err, dir);
          });
        else cb(null, dir);
      });
    },
    filename(req, file, cb) {
      cb(null, `${uuid4()}${path.extname(file.originalname)}`);
    },
  });

export const deleteFile = (filePath: string) => {
  logger.debug(`Delete file: ${filePath}`);
  if (!filePath) {
    logger.error(`File by this pass ${filePath} doesn't found`);
    return;
  }
  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error(`Delete file not success, reason: ${err}`);
    }
  });
};

export const deleteFiles = (files: Express.Multer.File[]) => {
  files.forEach((file) => {
    deleteFile(file.path);
  });
};
