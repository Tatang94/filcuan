
import { supabase } from './supabase';
import { CuanContent, CuanTheme } from '../types';

// --- STORAGE SERVICES ---
export const uploadMedia = async (file: File | Blob, folder: 'posters' | 'contents'): Promise<string> => {
  const ext = 'png';
  const contentType = 'image/png';
  
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('media') 
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteMediaByUrl = async (url: string) => {
  try {
    const path = url.split('/storage/v1/object/public/media/')[1];
    if (path) {
      await supabase.storage.from('media').remove([path]);
    }
  } catch (e) {
    console.error("Gagal hapus file storage:", e);
  }
};

// --- AUTH SERVICES ---
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return profile;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUpUser = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: { data: { username: username } }
  });
  if (error) throw error;
  
  if (data.user) {
    // FIX: Gunakan format ISO (YYYY-MM-DD) agar tidak error syntax di database
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: username,
      display_name: username,
      coins: 0,
      joined_date: new Date().toISOString().split('T')[0] 
    });
    if (profileError) throw profileError;
  }
  return data;
};

export const saveUserData = async (userId: string, updates: any) => {
  await supabase.from('profiles').update({ 
    display_name: updates.displayName || updates.display_name,
    coins: updates.coins,
    photo_url: updates.photoURL || updates.photo_url
  }).eq('id', userId);
};

// --- FEED & INTERACTION SERVICES ---
export const getFeed = async (): Promise<any[]> => {
  const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
  return (data || []).map(v => ({
    id: v.id,
    title: v.title,
    image_url: v.video_url,
    creator_id: 'admin',
    creator_name: 'Admin Filcuan',
    themeId: v.category_id,
    tags: v.tags || []
  }));
};

export const handleInteraction = async (userId: string, imageId: string, imageUrl: string, type: 'like' | 'download') => {
  const points = type === 'like' ? 1 : 2;

  const { data: profile } = await supabase.from('profiles').select('coins').eq('id', userId).single();
  if (profile) {
    await supabase.from('profiles').update({ coins: profile.coins + points }).eq('id', userId);
  }

  await supabase.from('videos').delete().eq('id', imageId);
  await deleteMediaByUrl(imageUrl);
};

// --- ADMIN SERVICES ---
export const saveContent = async (content: CuanContent) => {
  const { error } = await supabase.from('videos').upsert({
    id: content.id,
    title: content.title,
    video_url: content.image_url,
    poster: content.poster,
    category_id: content.themeId,
    description: content.description,
    tags: content.tags
  });
  if (error) throw error;
};

export const getAllContent = async (): Promise<CuanContent[]> => {
  const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
  return (data || []).map(v => ({
    id: v.id,
    title: v.title,
    image_url: v.video_url,
    poster: v.poster || null,
    themeId: v.category_id,
    description: v.description,
    tags: v.tags || []
  }));
};

export const deleteContent = async (id: string) => {
  const { error } = await supabase.from('videos').delete().eq('id', id);
  if (error) throw error;
};

export const getThemes = async (): Promise<CuanTheme[]> => {
  const { data } = await supabase.from('categories').select('*');
  return data || [];
};

export const saveTheme = async (theme: CuanTheme) => {
  const { error } = await supabase.from('categories').upsert({
    id: theme.id,
    name: theme.name
  });
  if (error) throw error;
};

export const deleteTheme = async (id: string) => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
};

export const getPayouts = async (): Promise<any[]> => {
  const { data } = await supabase.from('withdrawals').select('*').order('created_at', { ascending: false });
  return data || [];
};

export const addWithdrawalRequest = async (request: any) => {
  const { error } = await supabase.from('withdrawals').insert({
    username: request.username,
    amount: request.amount,
    method: request.method,
    status: request.status
  });
  if (error) throw error;
};

export const updateWithdrawalStatus = async (id: string, status: string) => {
  const { error } = await supabase.from('withdrawals').update({ status }).eq('id', id);
  if (error) throw error;
};
