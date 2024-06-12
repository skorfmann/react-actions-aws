'use server'

import { S3Client, ListBucketsCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const getBucketNames = async (): Promise<string[]> => {
  const client = new S3Client({ region: 'eu-central-1'}); // specify your region
  const command = new ListBucketsCommand({});

  try {
    const data = await client.send(command);
    const bucketNames = (data.Buckets?.map(bucket => bucket.Name) || []).filter((name): name is string => typeof name === 'string');
    console.log('S3 Bucket Names:', bucketNames);
    return bucketNames;
  } catch (error) {
    console.error('Error fetching S3 bucket names:', error);
    throw error;
  }
};

export const getBucketObjects = async (bucketName: string): Promise<{ name: string, size: number }[]> => {
  const client = new S3Client({ region: 'eu-central-1'}); // specify your region
  const command = new ListObjectsV2Command({ Bucket: bucketName, MaxKeys: 10 });

  try {
    const data = await client.send(command);
    const objects = (data.Contents?.map(object => ({
      name: object.Key,
      size: object.Size
    })) || []).filter((object): object is { name: string, size: number } => typeof object.name === 'string' && typeof object.size === 'number');
    console.log(`Objects in ${bucketName}:`, objects);
    return objects;
  } catch (error) {
    console.error(`Error fetching objects from bucket ${bucketName}:`, error);
    throw error;
  }
};

export const deleteObject = async (bucketName: string, objectKey: string): Promise<void> => {
  const client = new S3Client({ region: 'eu-central-1'}); // specify your region
  const command = new DeleteObjectCommand({ Bucket: bucketName, Key: objectKey });

  try {
    await client.send(command);
    console.log(`Deleted object ${objectKey} from bucket ${bucketName}`);
  } catch (error) {
    console.error(`Error deleting object ${objectKey} from bucket ${bucketName}:`, error);
    throw error;
  }
};
