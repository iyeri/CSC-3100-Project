// signuplogin-service.ts
import type { SupabaseClient } from "@supabase/supabase-js";

/* signup()
 *
 * Input:
 * email, password
 *
 * Returns:
 * The newly created user.
 *
 * On error, returns undefined.
 * 
 * Notes:
 * Supabase salts and hashes the password on its own. There is no need to manually
 * salt and hash the password in the backend.
 */
export async function signup(
    supabase: SupabaseClient, 
    email: string, 
    password: string) {
    const { data, error } = await supabase.auth
        .signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: "http://localhost:8000" // Change this to login page.
            }
        })

    if (error) {
        console.error(error);
        return;
    }

    return data.user;
}

/* login()
 *
 * Input:
 * email, password
 *
 * Returns:
 * The authenticated session.
 *
 * On error, returns undefined.
 * 
 * Notes:
 * Supabase salts and hashes the password on its own. There is no need to manually
 * salt and hash the password in the backend.
 */
export async function login(
    supabase: SupabaseClient, 
    email: string, 
    password: string) {
    const { data, error } = await supabase.auth
        .signInWithPassword({
            email: email,
            password: password
        })

    if (error) {
        console.error(error);
        return;
    }

    return data.session;
}