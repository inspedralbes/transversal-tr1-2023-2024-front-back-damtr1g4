import pandas as pd
import matplotlib.pyplot as plt
import pymysql
import os  

# Conexión a la base de datos
conn = pymysql.connect(
    host='dam.inspedralbes.cat',
    user='a22polazasot_users',
    password='Contrasenya2004',
    database='a22polazasot_baseTienda'
)

# Definir una consulta SQL para obtener las comandas finalizadas
sql_query = """
    SELECT c.data AS fecha, SUM(c.preu) AS total_dia
    FROM comandes c
    WHERE c.finalitzada = TRUE
    GROUP BY c.data
    ORDER BY c.data ASC
"""

# Ejecutar la consulta y almacenar los resultados en un DataFrame de Pandas
df = pd.read_sql(sql_query, conn)

# Mostrar el resultado de la consulta
print(df)

# Cerrar la conexión con la base de datos
conn.close()

# Crear un gráfico de barras de las comandas finalizadas
plt.figure(figsize=(10, 6))
plt.bar(df['fecha'].astype(str), df['total_dia'])
plt.title("Ingresos Diarios")
plt.xlabel("Fecha")
plt.ylabel("Ingresos Totales")
plt.grid(axis='y', linestyle='--', alpha=0.6)

folder_path = './grafics'

if not os.path.exists(folder_path):
    os.makedirs(folder_path)

image_path = os.path.join(folder_path, 'RecaudacioPerDates.png')

plt.savefig(image_path)
