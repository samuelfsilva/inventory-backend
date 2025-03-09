IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'inventory')
BEGIN
    CREATE DATABASE inventory;
    PRINT 'Database inventory created.';
END
ELSE
BEGIN
    PRINT 'Database inventory already exists.';
END
