// test-s3-connection.js
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { s3, bucketName } = require("./backend/configs/bucket.config");
require("dotenv").config();
// --- Configuration ---
// Option 1: If you have your s3 client and bucketName already configured in a shared file
// (like your `configs/bucket.config.js`), you can try importing them.
// Make sure the path is correct relative to this test script.
/*
try {
    const { s3, bucketName } = require('./configs/bucket.config.js'); // Adjust path as needed
    checkS3Connection(s3, bucketName);
} catch (e) {
    console.error("Could not import from bucket.config.js, trying manual configuration below.", e.message);
    // Fallback to manual configuration if import fails
    manualS3Configuration();
}
*/

// Option 2: Manual configuration (use this if Option 1 is not suitable or fails)
// Call this function directly or as a fallback.
manualS3Configuration();

async function manualS3Configuration() {
  // Replace with your actual S3 bucket name and region
  const BUCKET_NAME = bucketName;
  const REGION = s3.config.bucketRegion; // e.g., "us-east-1", "us-west-2", etc. <<< REPLACE THIS

  console.log("S3 Bucket Config Loaded ", {
    bucketRegion: s3.config.bucketRegion,
    bucketName,
  });
  // Ensure your AWS credentials are configured (e.g., via environment variables,
  // shared credentials file ~/.aws/credentials, or IAM role).
  // For local testing, the shared credentials file is common.
  // If using environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, (optionally) AWS_SESSION_TOKEN

  const s3Client = new S3Client({ region: REGION });


  await checkS3Connection(s3Client, BUCKET_NAME);
}

async function checkS3Connection(s3, bucketName) {
  console.log(`Attempting to connect to S3 bucket: ${bucketName}...`);

  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    MaxKeys: 5, // List only the first 5 objects for a quick test
  });

  try {
    const data = await s3.send(command);
    console.log("\n✅ Successfully connected to S3!");
    console.log(`Bucket: ${bucketName}`);

    if (data.Contents && data.Contents.length > 0) {
      console.log("\nFirst few objects in the bucket:");
      data.Contents.forEach((item) => {
        console.log(
          `  - ${item.Key} (Size: ${item.Size} bytes, LastModified: ${item.LastModified})`
        );
      });
    } else if (data.KeyCount === 0) {
      console.log(
        "\nBucket is empty or no objects match the query (MaxKeys was 5)."
      );
    } else {
      console.log(
        "\nCould not list objects, but connection might still be okay if KeyCount is defined:",
        data
      );
    }
    console.log("\nTest completed successfully.");
  } catch (error) {
    console.error("\n❌ Failed to connect to S3 or list objects:");
    console.error("Error Code:", error.name); // e.g., NoSuchBucket, AccessDenied, InvalidAccessKeyId
    console.error("Error Message:", error.message);
    console.error("Region configured for client:", await s3.config.region()); // Check the client's configured region
    console.error("Timestamp:", new Date().toISOString());

    console.log("\nTroubleshooting tips:");
    console.log(
      "1. Verify AWS credentials (access key, secret key, session token if applicable)."
    );
    console.log(
      "   - Ensure they are correctly set in your environment or ~/.aws/credentials file."
    );
    console.log(
      "   - For IAM roles (e.g., on EC2/Lambda), ensure the role has S3 permissions."
    );
    console.log(
      "2. Double-check the S3 bucket name and ensure it exists and you spelled it correctly."
    );
    console.log(
      "3. Confirm the S3 bucket's region matches the region configured in the S3Client."
    );
    console.log(
      "   - If your bucket is in `us-west-2`, your S3Client region should also be `us-west-2`."
    );
    console.log(
      "4. Check IAM permissions: The credentials need at least `s3:ListBucket` permission for the specified bucket."
    );
    console.log(
      "   - For more specific operations (like PutObject), you'll need `s3:PutObject`, etc."
    );
    console.log(
      "5. If behind a proxy or firewall, ensure it allows outbound connections to AWS S3 endpoints."
    );
  }
}
