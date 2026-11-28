import { UserProfile } from './types';

/**
 * 2 Pre-configured Verified Google Demo Accounts
 * Designed specifically for side-by-side Chrome + Incognito demos
 */
export const demoGoogleAccounts: UserProfile[] = [
  {
    id: 'usr-google-alex',
    name: 'Alex Rivers',
    email: 'alex.rivers.dev@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'Principal Cloud Architect (Google)',
    status: 'online',
    provider: 'google'
  },
  {
    id: 'usr-google-elena',
    name: 'Elena Rostova',
    email: 'elena.rostova.tech@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Systems Engineer (Google)',
    status: 'online',
    provider: 'google'
  }
];

export const loginWithGoogle = async (accountIndex = 0): Promise<UserProfile> => {
  // Realistic Google OAuth response delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const selected = demoGoogleAccounts[accountIndex] || demoGoogleAccounts[0];
  localStorage.setItem('pulse_google_user', JSON.stringify(selected));
  return selected;
};

export const logoutGoogle = async (): Promise<void> => {
  localStorage.removeItem('pulse_google_user');
};
