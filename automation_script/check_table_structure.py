import psycopg2

# Connect to database
conn = psycopg2.connect(
    host='192.168.10.232',
    port=5432,
    database='duetto_analytics_db',
    user='postgres',
    password='postgrespw'
)

cursor = conn.cursor()

# Get table structure
cursor.execute("""
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'DeviceSensorMasters'
    ORDER BY ordinal_position;
""")

columns = cursor.fetchall()

print('\nDeviceSensorMasters Table Structure:')
print('-' * 80)
for col in columns:
    print(f'{col[0]:30} {col[1]:20} Default: {col[2]}, Nullable: {col[3]}')

cursor.close()
conn.close()
