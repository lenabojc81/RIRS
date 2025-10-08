import { baseURL } from '../../global';

export interface UserProfile {
    uid: string;
    email: string;
    username: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthResponse {
    success: boolean;
    user?: UserProfile;
    error?: string;
}

export interface RegistrationData {
    email: string;
    password: string;
    username: string;
}

export interface LoginData {
    email: string;
    password: string;
}

// API call helper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${baseURL}/auth${endpoint}`, {
        ...options,
        credentials: 'include', // Include cookies for authentication
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    return await response.json();
};

// Register new user
export const registerUser = async (userData: RegistrationData): Promise<AuthResponse> => {
    try {
        const response = await apiCall('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        return response;
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: 'Network error occurred during registration'
        };
    }
};

// Login user
export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
    try {
        const response = await apiCall('/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: 'Network error occurred during login'
        };
    }
};

// Logout user
export const logoutUser = async (): Promise<boolean> => {
    try {
        const response = await apiCall('/logout', {
            method: 'POST',
        });

        return response.success;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

// Get current user profile
export const getCurrentUser = async (): Promise<UserProfile | null> => {
    try {
        const response = await apiCall('/me');
        return response.success ? response.user : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

// Update user profile
export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
        const response = await apiCall('/profile', {
            method: 'PUT',
            body: JSON.stringify(updates),
        });

        return response.success;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return false;
    }
};

// Auth state management for frontend
class AuthManager {
    private currentUser: UserProfile | null = null;
    private listeners: Array<(user: UserProfile | null) => void> = [];

    async checkAuthState(): Promise<UserProfile | null> {
        const user = await getCurrentUser();
        this.currentUser = user;
        this.notifyListeners();
        return user;
    }

    getCurrentUser(): UserProfile | null {
        return this.currentUser;
    }

    async login(loginData: LoginData): Promise<AuthResponse> {
        const result = await loginUser(loginData);
        if (result.success && result.user) {
            this.currentUser = result.user;
            this.notifyListeners();
        }
        return result;
    }

    async register(userData: RegistrationData): Promise<AuthResponse> {
        const result = await registerUser(userData);
        if (result.success && result.user) {
            this.currentUser = result.user;
            this.notifyListeners();
        }
        return result;
    }

    async logout(): Promise<boolean> {
        const success = await logoutUser();
        if (success) {
            this.currentUser = null;
            this.notifyListeners();
        }
        return success;
    }

    onAuthStateChange(callback: (user: UserProfile | null) => void) {
        this.listeners.push(callback);
        // Call immediately with current state
        callback(this.currentUser);
        
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentUser));
    }
}

// Export singleton auth manager
export const authManager = new AuthManager();