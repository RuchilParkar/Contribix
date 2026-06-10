'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProfileData } from './github';
import { calculateDeveloperScore, ScoreBreakdown } from './scoring';
import { getGitHubUserDataAction } from './actions';

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
  const [username, setUsername] = useState<string>('RuchilParkar'); // Default profile
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (uname: string) => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);
    try {
      // Fetch data using server action
      const res = await getGitHubUserDataAction(uname);
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to fetch developer details.');
      }
      setProfileData(res.data);
      
      // Calculate scores
      const computedScore = calculateDeveloperScore(res.data);
      setScore(computedScore);
      setUsername(uname);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch developer details.';
      console.error('Failed to load profile details:', err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const userParam = params.get('username') || params.get('user');
      const target = userParam || username;
      Promise.resolve().then(() => {
        loadProfile(target);
      });
    }
  }, [loadProfile, username]);

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
