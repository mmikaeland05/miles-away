import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL  = "https://ehoorhiscnrkjklivzzy.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVob29yaGlzY25ya2prbGl2enp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDkyMzcsImV4cCI6MjA5MDY4NTIzN30.zuc11CKZ72SjKjBA3tuJ5GGe73dcVJIbwM_gcxa4-ec";

//  sets up the connection to Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// fetches every row from whichever table
export async function getAll(table) {
    const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

// fetches a single row by its id
export async function getOne(table, id) {
    const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
}

//  inserts a new row into a table
export async function addItem(table, payload) {
    const { data, error } = await supabase
        .from(table)
        .insert([payload])
        .select()
        .single();
    if (error) throw error;
    return data;
}

// deletes a single row by its id
export async function deleteItem(table, id) {
    const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);
    if (error) throw error;
}

// uploads an image file to Supabase Storage
export async function uploadImage(file, folder) {
    const ext      = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filename, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from("media")
        .getPublicUrl(filename);

    return data.publicUrl;
}

// converts a raw ISO timestamp into a readable format
export function formatDate(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

// updates an existing row by its id with new values.
export async function updateItem(table, id, payload) {
    const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq('id', id)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}