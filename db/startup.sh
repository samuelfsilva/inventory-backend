#!/bin/bash
# Inicia o SQL Server em segundo plano
/opt/mssql/bin/sqlservr &

# Aguarda o SQL Server iniciar
echo "Waiting for SQL Server to start..."
sleep 10s

# Executa o script SQL para criar o banco de dados
echo "Running init-db.sql..."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -i /usr/src/app/init-db.sql

# Mantém o container em execução
echo "SQL Server is ready."
wait
