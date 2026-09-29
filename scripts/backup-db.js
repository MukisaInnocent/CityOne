#!/usr/bin/env node

/**
 * City One Adventures - Database Backup Script
 * Run this via crontab daily.
 * e.g., 0 2 * * * /usr/bin/node /var/www/cityone/scripts/backup-db.js
 */

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'cityone_adventures';
const DB_HOST = process.env.DB_HOST || 'localhost';

const date = new Date().toISOString().split('T')[0];
const backupDir = path.join(__dirname, '..', 'backups');
const fileName = `${DB_NAME}_backup_${date}.sql.gz`;
const filePath = path.join(backupDir, fileName);

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Construct mysqldump command
const dumpCmd = `mysqldump -h ${DB_HOST} -u ${DB_USER} ${DB_PASS ? `-p${DB_PASS}` : ''} ${DB_NAME} | gzip > ${filePath}`;

console.log(`Starting database backup for ${DB_NAME}...`);

exec(dumpCmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup error: ${error.message}`);
    return;
  }
  if (stderr && !stderr.includes('Warning: Using a password')) {
    console.error(`Backup stderr: ${stderr}`);
  }
  
  console.log(`Backup completed successfully: ${filePath}`);
  
  // TODO: Add AWS S3 upload logic here
  // e.g., aws s3 cp ${filePath} s3://cityone-backups/db/${fileName}
  
  // Clean up old backups (keep last 7 days)
  const files = fs.readdirSync(backupDir);
  const now = Date.now();
  files.forEach(file => {
    const fullPath = path.join(backupDir, file);
    const stats = fs.statSync(fullPath);
    const daysOld = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld > 7) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted old backup: ${file}`);
    }
  });
});
