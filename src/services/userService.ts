import api from '@/lib/axios';
import { User, AuthTokens, LoginCredentials, RegisterData, ApiEnvelope, AuthData } from '@/types';

function parseJwtPayload(token: string): { sub: number; email: string; roles?: string[] } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function buildUser(authData: AuthData, formData?: { name?: string; email?: string; phone?: string }): User {
  // If the API returned a user object, use it
  if (authData.user) {
    const raw = authData.user;
    return {
      id: String(raw.id),
      email: raw.email,
      name: raw.name || raw.email,
      firstName: raw.customer?.person?.firstName || raw.firstName || '',
      lastName: raw.customer?.person?.lastName || raw.lastName || '',
      phone: raw.phone || raw.customer?.phone || '',
      avatar: raw.avatar,
      role: raw.roles?.[0],
      regionId: raw.customer?.regionId,
      customerId: raw.customerId || raw.customer?.id,
    };
  }

  // Otherwise, extract basic info from the JWT + form data
  const payload = parseJwtPayload(authData.accessToken);

  return {
    id: String(payload?.sub || '0'),
    email: payload?.email || formData?.email || '',
    name: formData?.name || payload?.email || '',
    phone: formData?.phone || '',
    role: payload?.roles?.[0],
  };
}

export async function login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
  const response = await api.post<ApiEnvelope<AuthData>>('/api/auth/login', credentials);
  const authData = response.data.data;

  const tokens: AuthTokens = {
    accessToken: authData.accessToken,
    refreshToken: authData.refreshToken,
  };

  const user = buildUser(authData, { email: credentials.email });

  return { user, tokens };
}

export async function register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
  const response = await api.post<ApiEnvelope<AuthData>>('/api/auth/register/customer', data);
  const authData = response.data.data;

  const tokens: AuthTokens = {
    accessToken: authData.accessToken,
    refreshToken: authData.refreshToken,
  };

  const user = buildUser(authData, { name: data.name, email: data.email, phone: data.phone });

  return { user, tokens };
}

export async function refreshToken(refreshTokenValue: string): Promise<{ tokens: AuthTokens }> {
  const response = await api.post<ApiEnvelope<AuthData>>('/api/auth/refresh-token', {
    refreshToken: refreshTokenValue,
  });

  const authData = response.data.data;

  return {
    tokens: {
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
    },
  };
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}

export function saveSession(user: User, tokens: AuthTokens): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export function loadSession(): { user: User; tokens: AuthTokens } | null {
  if (typeof window === 'undefined') return null;

  const accessToken = localStorage.getItem('access_token');
  const refreshTokenVal = localStorage.getItem('refresh_token');
  const userStr = localStorage.getItem('user');

  if (accessToken && refreshTokenVal && userStr) {
    try {
      return {
        user: JSON.parse(userStr),
        tokens: { accessToken, refreshToken: refreshTokenVal },
      };
    } catch {
      return null;
    }
  }
  return null;
}
