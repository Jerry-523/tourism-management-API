import sqlite3

# Função para conectar ao banco de dados
def conectar_bd():
    conn = sqlite3.connect('companhia_aerea.db')
    conn.row_factory = sqlite3.Row
    return conn

# Função para adicionar a coluna "passaporte" na tabela "Passageiros"
def adicionar_coluna_passaporte():
    conn = conectar_bd()
    cursor = conn.cursor()

    # Adiciona a coluna "passaporte" na tabela "Passageiros"
    cursor.execute('''ALTER TABLE Passageiros ADD COLUMN passaporte TEXT NOT NULL DEFAULT '' ''')
    
    conn.commit()
    conn.close()

# Executa a migração de esquema
if __name__ == "__main__":
    adicionar_coluna_passaporte()
    print("Migração de esquema concluída com sucesso.")
