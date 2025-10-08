import psycopg2

# Connect to default postgres database
conn = psycopg2.connect(
    host='192.168.10.232',
    port=5432,
    database='postgres',
    user='postgres',
    password='postgrespw'
)

cursor = conn.cursor()

# List all databases
print('\n[DEBUG] All databases on server:')
cursor.execute("SELECT datname FROM pg_database WHERE datistemplate = false;")
databases = cursor.fetchall()
for db in databases:
    print(f'  - {db[0]}')

cursor.close()
conn.close()

# Now try to connect to each database and check for tables
for db_name in [d[0] for d in databases]:
    print(f'\n[DEBUG] Checking database: {db_name}')
    try:
        conn = psycopg2.connect(
            host='192.168.10.232',
            port=5432,
            database=db_name,
            user='postgres',
            password='postgrespw'
        )
        cursor = conn.cursor()

        cursor.execute("""
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
            ORDER BY table_schema, table_name
        """)
        tables = cursor.fetchall()

        if tables:
            print(f'[DEBUG] Tables found in {db_name}:')
            for schema, table in tables:
                print(f'  - {schema}.{table}')
        else:
            print(f'[DEBUG] No tables found in {db_name}')

        cursor.close()
        conn.close()
    except Exception as e:
        print(f'[ERROR] Could not connect to {db_name}: {e}')
