import { 
    anonymousSupabase,
    createAuthenticatedSupabase
} from "../services/client.ts";

/* attachAuthContext()
 *
 * Description:
 * Attaches the corresponding (anon, authenticated, service/admin) 
 * Supabase client to the request.
 *
 * Input:
 * req, res, next (this is automatically handled by Express)
 * 
 * Output:
 * Nothing; calls next function.
 */
export async function attachAuthContext(req, res, next) {
  const authorization = req.get("authorization");

  // No token: continue as anon.
  if (!authorization) {
    req.db_client = anonymousSupabase;
    req.user = null;
    return next();
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).send("Malformed authorization header.");
  }

  const authToken = match[1];
  const supabase = createAuthenticatedSupabase(authToken);
  
  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser(authToken);

    // Supplied tokens must be valid; don't fall back to anon.
    if (error || !user) {
      return res.status(401).send("Invalid or expired auth token.");
    }

    req.db_client = supabase; // Attach supabase client to request.
    req.user = user; // Attach user to request.

    return next();
  } catch (error) {
    return next(error);
  }
}

/* requireAuth()
 *
 * Description:
 * Checks if the request is coming from an authenticated user.
 *
 * Input:
 * req, res, next (this is automatically handled by Express)
 * 
 * Output:
 * Nothing; calls next function.
 */
export async function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).send("Authentication required.");
  }

  next();
}