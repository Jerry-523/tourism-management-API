# API de Gestão de Reservas de Hotel

Esta é uma API para gestão de reservas de hotel, desenvolvida utilizando o framework FastAPI e banco de dados SQLite e SQLAlchemy.

## Funcionalidades

- Criar uma nova reserva de hotel.
- Obter todas as reservas de hotel.
- Obter quartos disponíveis.
- Obter uma reserva pelo número de BI.
- Cancelar reserva pelo número de BI.
- Atualizar reserva pelo número de BI.

## Segurança

A API utiliza autenticação baseada em JWT para proteger as rotas e garantir que apenas usuários autenticados possam acessar e modificar os dados.

## Uso

### Executar o servidor

Dentro do diretório do projeto, execute o seguinte comando para iniciar o servidor:

```bash
uvicorn main:app --reload
```

### Acessar a documentação

Acesse a documentação da API em seu navegador:

[http://localhost:8000/docs](http://localhost:8000/docs)

### Endpoints de Autenticação

#### Registrar um novo usuário
- URL: `/users/`
- Método: `POST`
- Payload:
  ```json
  {
      "username": "johndoe",
      "email": "johndoe@example.com",
      "password": "yourpassword"
  }
  ```
- Resposta:
  ```json
  {
      "id": 1,
      "username": "johndoe",
      "email": "johndoe@example.com",
      "is_active": true
  }
  ```

#### Obter Token de Acesso
- URL: `/token`
- Método: `POST`
- Payload:
  ```json
  {
      "username": "johndoe",
      "password": "yourpassword"
  }
  ```
- Resposta:
  ```json
  {
      "access_token": "your.jwt.token.here",
      "token_type": "bearer"
  }
  ```

### Exemplos de Requisições

#### Criar uma nova reserva
- URL: `/criar_reserva/`
- Método: `POST`
- Payload:
  ```json
  {
      "numero_BI": "123456789",
      "nome_cliente": "John Doe",
      "email_cliente": "john.doe@example.com",
      "telefone_cliente": "1234567890",
      "tipo_quarto": "A",
      "check_in": "2024-06-01T14:00:00",
      "check_out": "2024-06-05T12:00:00",
      "status": "confirmada"
  }
  ```
- Resposta:
  ```json
  {
      "numero_BI": "123456789",
      "nome_cliente": "John Doe",
      "email_cliente": "john.doe@example.com",
      "telefone_cliente": "1234567890",
      "tipo_quarto": "A",
      "check_in": "2024-06-01T14:00:00",
      "check_out": "2024-06-05T12:00:00",
      "status": "confirmada"
  }
  ```

#### Obter todas as reservas
- URL: `/reservas/`
- Método: `GET`
- Resposta:
  ```json
  [
      {
          "numero_BI": "123456789",
          "nome_cliente": "John Doe",
          "email_cliente": "john.doe@example.com",
          "telefone_cliente": "1234567890",
          "tipo_quarto": "A",
          "check_in": "2024-06-01T14:00:00",
          "check_out": "2024-06-05T12:00:00",
          "status": "confirmada"
      }
  ]
  ```

#### Cancelar uma reserva
- URL: `/delete_reserva/{numero_BI}/`
- Método: `DELETE`
- Resposta:
  ```json
  {
      "message": "Reserva cancelada com sucesso."
  }
  ```

#### Obter disponibilidade dos quartos
- URL: `/quartos-disponiveis/`
- Método: `GET`
- Resposta:
  ```json
  {
      "Quartos disponíveis": {
          "Classe A": 5,
          "Classe B": 15,
          "Classe C": 30
      }
  }
  ```

#### Buscar uma reserva pelo número de BI
- URL: `/buscar_reserva/{numero_BI}/`
- Método: `GET`
- Resposta:
  ```json
  {
      "numero_BI": "123456789",
      "nome_cliente": "John Doe",
      "email_cliente": "john.doe@example.com",
      "telefone_cliente": "1234567890",
      "tipo_quarto": "A",
      "check_in": "2024-06-01T14:00:00",
      "check_out": "2024-06-05T12:00:00",
      "status": "confirmada"
  }
  ```

#### Atualizar uma reserva
- URL: `/atualizar_reserva/{numero_BI}/`
- Método: `PUT`
- Payload:
  ```json
  {
      "numero_BI": "123456789",
      "nome_cliente": "John Doe",
      "email_cliente": "john.doe@example.com",
      "telefone_cliente": "1234567890",
      "tipo_quarto": "A",
      "check_in": "2024-06-01T14:00:00",
      "check_out": "2024-06-05T12:00:00",
      "status": "confirmada"
  }
  ```
- Resposta:
  ```json
  {
      "numero_BI": "123456789",
      "nome_cliente": "John Doe",
      "email_cliente": "john.doe@example.com",
      "telefone_cliente": "1234567890",
      "tipo_quarto": "A",
      "check_in": "2024-06-01T14:00:00",
      "check_out": "2024-06-05T12:00:00",
      "status": "confirmada"
  }
  ```

## Diagramas

### Diagrama de Entidade Relacionamento

![diagramaa](https://github.com/Sengeki1/tourism-management-API/assets/92488227/24794d2d-0665-48a9-a640-c111bde174a3)


### Diagrama de Sequencia

![Diagrama de Sequencia_Hotel](https://github.com/Jerry-523/tourism-management-API/assets/92488227/384553e7-e980-48f9-b5f8-57ca453e639a)


### To Do

- [x] Cancelar reserva pelo ID;
- [x] Criar Base de Dados;
- [x] CRUD Completo;
- [x] Definir uma quantidade limitada de quartos e categorias;
- [x] Criar Diagramas Explicando o Codigo;
- [ ] Adicionar preco de Quartos;
- [x] Criar no server um metodo de autenticacao;
- [ ] Sistema de pagamento(strike);
- [ ] Verificar entradas;
- [ ] Gerar ficheiro de Logs
