/**
 * @file This stores our general configuration for our S3 photo bucket that holds files
 * @author Gian David Marquez
 */

require("../../loadEnv") // load environment variables from .env file
const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
    credentials: {
        accessKey: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    bucketRegion: process.env.BUCKET_REGION,
});

const bucketName = process.env.BUCKET_NAME;
module.exports = {
  s3,
  bucketName: bucketName,
};