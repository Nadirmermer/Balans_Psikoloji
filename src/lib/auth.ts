import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'uzman';
  uzman_id?: string;
  ad: string;
  soyad: string;
  aktif: boolean;
  last_login?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    // Sayfa yüklendiğinde token'ı kontrol et
    this.token = localStorage.getItem('auth_token');
    if (this.token) {
      this.validateToken();
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {


      // Kullanıcıyı doğrula
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', credentials.email)
        .eq('aktif', true)
        .single();

      if (error || !user) {
        throw new Error('Geçersiz e-posta veya şifre');
      }

      // Verify password using bcrypt
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Geçersiz e-posta veya şifre');
      }

      // Session oluştur
      const token = this.generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 saat

      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          token,
          expires_at: expiresAt.toISOString()
        });

      if (sessionError) {
        throw new Error('Oturum oluşturulamadı');
      }

      // Son giriş zamanını güncelle
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Token'ı sakla
      localStorage.setItem('auth_token', token);
      this.token = token;
      this.currentUser = user;

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        // Session'ı sil
        await supabase
          .from('user_sessions')
          .delete()
          .eq('token', this.token);
      }

      // Local storage'ı temizle
      localStorage.removeItem('auth_token');
      this.token = null;
      this.currentUser = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async validateToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const { data: session, error } = await supabase
        .from('user_sessions')
        .select(`
          *,
          admin_users (*)
        `)
        .eq('token', this.token)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !session || !session.admin_users) {
        this.logout();
        return false;
      }

      this.currentUser = session.admin_users;
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this.logout();
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: 'admin' | 'uzman'): boolean {
    return this.currentUser?.role === role;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Kullanıcı oturumu bulunamadı');
    }

    try {
      // Get current user's password hash
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('id', this.currentUser.id)
        .single();

      if (error || !user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      // Verify current password using bcrypt
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        throw new Error('Mevcut şifre yanlış');
      }

      // Yeni şifreyi güncelle
      const newPasswordHash = await this.hashPassword(newPassword);
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ 
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.currentUser.id);

      if (updateError) {
        throw new Error('Şifre güncellenemedi');
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    // Use bcrypt with salt rounds of 12 for secure password hashing
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  private generateToken(): string {
    return crypto.randomUUID() + '-' + Date.now().toString(36);
  }
}

export const authService = new AuthService();