const { Client } = require('pg');

// Railway PostgreSQL connection
// Extract from Supabase URL: https://kong-production-3701.up.railway.app
// Typically Railway PostgreSQL runs on port 5432 or a custom port

const connectionString = process.env.DATABASE_URL || '';

async function runMigration() {
  let client;
  
  try {
    // Try to connect using common Railway PostgreSQL patterns
    const configs = [
      { connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres' },
      { 
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'postgres'
      }
    ];
    
    for (const config of configs) {
      try {
        client = new Client(config);
        await client.connect();
        console.log('Connected to PostgreSQL');
        break;
      } catch (e) {
        console.log('Failed config:', JSON.stringify(config));
        if (client) await client.end().catch(() => {});
      }
    }
    
    if (!client) {
      console.log('\n❌ Could not connect to PostgreSQL directly.');
      console.log('\n📋 Please run the migration manually:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Copy and paste the SQL from: supabase/migrations/20250222000000_fix_admin_role_update.sql');
      console.log('3. Run the SQL');
      return;
    }
    
    const sql = `
-- Fix: Allow admins to update user system role (admin/moderator/user)
CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  p_user_id UUID,
  p_new_role TEXT
)
RETURNS void AS $$
DECLARE
  v_caller_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_caller_is_admin;

  IF NOT v_caller_is_admin THEN
    RAISE EXCEPTION 'Insufficient permissions: Only administrators can change user roles.';
  END IF;

  IF p_new_role NOT IN ('user', 'moderator', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be: user, moderator, or admin.';
  END IF;

  IF p_new_role = 'user' THEN
    DELETE FROM public.admins WHERE user_id = p_user_id;
  ELSE
    INSERT INTO public.admins (user_id, role)
    VALUES (p_user_id, p_new_role)
    ON CONFLICT (user_id) DO UPDATE SET role = p_new_role;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.admin_set_user_role(UUID, TEXT) TO authenticated;

-- Fix protect_role_column to allow SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION public.protect_role_column()
RETURNS TRIGGER AS $$
BEGIN
  IF current_setting('app.settings.is_secure', TRUE) = 'true' THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND role = 'admin') THEN
       RAISE EXCEPTION 'You are not authorized to change role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

    await client.query(sql);
    console.log('✅ Migration executed successfully!');
    
    // Verify the function was created
    const result = await client.query(`
      SELECT routine_name FROM information_schema.routines 
      WHERE routine_schema = 'public' AND routine_name = 'admin_set_user_role'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Function admin_set_user_role created successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    console.log('\n📋 Please run the migration manually in Supabase SQL Editor');
  } finally {
    if (client) {
      await client.end();
    }
  }
}

runMigration();
