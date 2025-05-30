```mermaid
%%{init: {'theme': 'dark'}}%%
erDiagram
    USERS ||--o{ SALES : creates
    CUSTOMERS ||--o{ SALES : makes
    PRODUCTS ||--o{ SALES : contains

    USERS {
        string _id PK
        string name
        string email
        string password
        string role
    }

    CUSTOMERS {
        string _id PK
        string name
        string email
        string phone
    }

    PRODUCTS {
        string _id PK
        string name
        number price
        number stock
        string category
    }

    SALES {
        string _id PK
        string userId FK
        string customerId FK
        string productId FK
        number quantity
        number total
        date saleDate
    }


```
