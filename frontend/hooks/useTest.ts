"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { TestType } from '@/lib/types';

const useTest = () => {
  const [data, setData] = useState<TestType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users");
        setData(response.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, error, isLoading };
};

export default useTest;