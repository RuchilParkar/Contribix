'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchGitHubUserData, ProfileData } from './github';
import { calculateDeveloperScore, ScoreBreakdown } from './scoring';

interface ProfileContextType {
  username: string;
  profileData: ProfileData | null;
  score: ScoreBreakdown | null;
  isLoading: boolean;
  error: string | null;
  searchProfile: (uname: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string>('gaearon'); // Default profile
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (uname: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch data using github utility
      const data = await fetchGitHubUserData(uname);
      setProfileData(data);
      
      // Calculate scores
      const computedScore = calculateDeveloperScore(data);
      setScore(computedScore);
      setUsername(uname);
    } catch (err: any) {
      console.error('Failed to load profile details:', err);
      setError(err.message || 'Failed to fetch developer details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const userParam = params.get('username') || params.get('user');
      if (userParam) {
        loadProfile(userParam);
      } else {
        loadProfile(username);
      }
    }
  }, [loadProfile]);

  const searchProfile = async (uname: string) => {
    if (!uname.trim()) return;
    await loadProfile(uname.trim());
  };

  const refreshProfile = async () => {
    await loadProfile(username);
  };

  return (
    <ProfileContext.Provider
      value={{
        username,
        profileData,
        score,
        isLoading,
        error,
        searchProfile,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
