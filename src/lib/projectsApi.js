import { supabase, BUCKET } from './supabaseClient';

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
const MAX_FILE_BYTES = 20 * 1024 * 1024; // matches the 20 MB limit on the "portfolio" bucket
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
];
const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1080&q=80';

// ---------------------------------------------------------------------------
// Converting between database rows (snake_case) and site projects (camelCase)
// ---------------------------------------------------------------------------
export function rowToProject(row) {
  const isVideo = row.media_type === 'video';
  return {
    id: row.id,
    title: row.title,
    client: row.client || '',
    year: row.year || '',
    category: row.category,
    tools: row.tools || [],
    mediaType: row.media_type,
    aspectRatio: row.aspect_ratio || 'Native',
    aspectRatioValue: row.aspect_ratio_value != null ? Number(row.aspect_ratio_value) : undefined,
    mediaUrl: row.media_url || '',
    mediaPath: row.media_path || null,
    thumbnailUrl: row.thumbnail_url || (isVideo ? '' : row.media_url || ''),
    thumbnailPath: row.thumbnail_path || null,
    beforeMediaUrl: row.before_media_url || undefined,
    embedUrl: row.embed_url || undefined,
    interactiveType: row.interactive_type || undefined,
    colorPalette: row.color_palette || [],
    description: row.description || '',
    tags: row.tags || [],
    featured: !!row.featured,
    createdAt: row.created_at,
  };
}

function projectToRow(p) {
  return {
    title: p.title,
    client: p.client || null,
    year: p.year || null,
    category: p.category,
    tools: p.tools || [],
    media_type: p.mediaType || 'image',
    aspect_ratio: p.aspectRatio || null,
    aspect_ratio_value: p.aspectRatioValue != null ? p.aspectRatioValue : null,
    media_url: p.mediaUrl || null,
    media_path: p.mediaPath || null,
    thumbnail_url: p.thumbnailUrl || null,
    thumbnail_path: p.thumbnailPath || null,
    before_media_url: p.beforeMediaUrl || null,
    embed_url: p.embedUrl || null,
    interactive_type: p.interactiveType || null,
    color_palette: p.colorPalette || [],
    description: p.description || null,
    tags: p.tags || [],
    featured: !!p.featured,
  };
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
// Returns null when sign-in worked, or an error message to show on screen.
export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ---------------------------------------------------------------------------
// Reading projects (everyone can do this)
// ---------------------------------------------------------------------------
export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToProject);
}

// ---------------------------------------------------------------------------
// Image helpers: shrink big images before upload to save storage and bandwidth
// ---------------------------------------------------------------------------
// Returns a smaller WebP copy, or the original file if it can't be improved.
export async function optimizeImage(file, maxSide = 2400, quality = 0.85) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
    if (bitmap.close) bitmap.close();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'design';
    return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
  } catch (err) {
    console.warn('Could not optimise image, uploading the original instead:', err);
    return file;
  }
}

// ---------------------------------------------------------------------------
// Storage (images and videos)
// ---------------------------------------------------------------------------
async function uploadFile(file, folder) {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

async function removeFiles(paths) {
  const list = paths.filter(Boolean);
  if (list.length === 0) return;
  const { error } = await supabase.storage.from(BUCKET).remove(list);
  if (error) console.warn('Could not remove old files:', error.message);
}

// ---------------------------------------------------------------------------
// Adding a project (team members only)
// ---------------------------------------------------------------------------
// fields: the form values. file: the chosen image/video (or null if a link was pasted).
export async function createProject(fields, file) {
  let mediaUrl = fields.mediaUrl || '';
  let mediaPath = null;
  let thumbnailUrl = '';
  let thumbnailPath = null;

  if (file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Unsupported file type. Please use JPG, PNG, WebP, GIF, MP4 or WebM.');
    }
    const isVideo = file.type.startsWith('video/');
    const main = isVideo ? file : await optimizeImage(file, 2400, 0.85);

    if (main.size > MAX_FILE_BYTES) {
      throw new Error('That file is larger than 20 MB. Please compress it and try again.');
    }

    const uploaded = await uploadFile(main, 'media');
    mediaUrl = uploaded.url;
    mediaPath = uploaded.path;

    if (!isVideo) {
      const thumb = await optimizeImage(file, 900, 0.8);
      if (thumb !== file) {
        const uploadedThumb = await uploadFile(thumb, 'thumbs');
        thumbnailUrl = uploadedThumb.url;
        thumbnailPath = uploadedThumb.path;
      } else {
        thumbnailUrl = mediaUrl;
      }
    }
  } else if (fields.mediaType !== 'video') {
    mediaUrl = mediaUrl || PLACEHOLDER_IMAGE;
    thumbnailUrl = mediaUrl;
  }

  const row = projectToRow({
    ...fields,
    mediaUrl,
    mediaPath,
    thumbnailUrl,
    thumbnailPath,
  });

  const { data, error } = await supabase.from('projects').insert(row).select().single();
  if (error) {
    await removeFiles([mediaPath, thumbnailPath]); // don't leave orphaned files behind
    throw new Error(`Could not save the project: ${error.message}`);
  }
  return rowToProject(data);
}

// ---------------------------------------------------------------------------
// Deleting a project (team members only)
// ---------------------------------------------------------------------------
export async function deleteProject(project) {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', project.id)
    .select();
  if (error) throw new Error(`Could not delete the project: ${error.message}`);
  if (!data || data.length === 0) {
    throw new Error('Nothing was deleted. Please sign in again and try once more.');
  }
  await removeFiles([project.mediaPath, project.thumbnailPath]);
}

// ---------------------------------------------------------------------------
// Importing a JSON backup (team members only)
// ---------------------------------------------------------------------------
export async function importProjects(list) {
  const rows = list
    .filter((p) => p && p.title && p.category)
    .map(projectToRow);
  if (rows.length === 0) throw new Error('No valid projects were found in that file.');

  const { data, error } = await supabase.from('projects').insert(rows).select();
  if (error) throw new Error(`Import failed: ${error.message}`);
  return (data || []).map(rowToProject);
}
