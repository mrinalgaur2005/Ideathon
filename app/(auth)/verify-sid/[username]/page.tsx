'use client';

import { CldUploadButton } from 'next-cloudinary';
import { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

const SIDVerificationPage = () => {
  const { username } = useParams();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (result: any) => {
    setImage(result.info.secure_url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !image) {
      setMessage('User ID or Image is missing.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`/api/verify-sid/${username}`, {
        username,
        image,
      });

      if (response.data.success) {
        setMessage(response.data.message);
        router.replace('/');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      setMessage('Error verifying user.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold text-center mb-6">SID Verification</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Upload Image:</label>
            <CldUploadButton
              uploadPreset="your_cloudinary_upload_preset"
              onUpload={handleImageUpload}
              options={{ cropping: true, resourceType: "image" }}
            />
          </div>

          <div className="flex justify-center">
            <button 
              type="submit" 
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>

        {message && (
          <p className="mt-4 text-center text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default SIDVerificationPage;
