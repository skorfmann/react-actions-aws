'use client';

import { useState } from 'react';
import { getBucketNames, getBucketObjects, deleteObject } from '../actions/actions';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Cloud = () => {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [objects, setObjects] = useState<{ name: string, size: number }[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

  const handleFetchBuckets = async () => {
    const bucketNames = await getBucketNames();
    setBuckets(bucketNames);
    console.log(bucketNames);
  };

  const handleFetchObjects = async (bucketName: string) => {
    const bucketObjects = await getBucketObjects(bucketName);
    setObjects(bucketObjects);
    setSelectedBucket(bucketName);
    console.log(bucketObjects);
  };

  const handleDeleteObject = async (bucketName: string, objectKey: string) => {
    await deleteObject(bucketName, objectKey);
    // Refresh the object list after deletion
    handleFetchObjects(bucketName);
  };

  const data = {
    labels: objects.map(object => object.name),
    datasets: [
      {
        label: 'Object Sizes (bytes)',
        data: objects.map(object => object.size),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="border-blue-400 -mx-4 mt-4 rounded border border-dashed p-4">
      <button
        onClick={handleFetchBuckets}
        className="rounded-sm bg-black px-2 py-0.5 text-sm text-white mb-4"
      >
        Fetch Buckets
      </button>
      <select
        onChange={(e) => handleFetchObjects(e.target.value)}
        className="rounded bg-gray-100 p-2 mb-4"
      >
        <option value="" disabled selected>Select a bucket</option>
        {buckets.map((bucket, index) => (
          <option key={index} value={bucket}>
            {bucket}
          </option>
        ))}
      </select>
      {selectedBucket && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Objects in {selectedBucket}:</h3>
          <ul className="space-y-1 mt-2">
            {objects.map((object, index) => (
              <li key={index} className="flex justify-between items-center rounded bg-gray-50 p-1">
                <span>{object.name} ({object.size} bytes)</span>
                <button
                  onClick={() => handleDeleteObject(selectedBucket, object.name)}
                  className="ml-2 rounded-sm bg-red-500 px-2 py-0.5 text-sm text-white"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 w-full">
            <Bar data={data} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      )}
    </section>
  );
};
