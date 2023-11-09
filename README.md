## CULTIVA - SUSTAINABLE E-COMMERCE

WORK IN PROGRESS

## ROUTES (TO DO LIST)

# USER 

  - `/user` (POST) => Create user
    - JSON EXAMPLE
    ```
      {
        "name": "name",
        "email": "email@email.com",
        "password": "password123"
      }
    ```
    - RESPONSE EXAMPLE
    ```
      {
        "id": "uuid generated",
        "name": "name",
        "email": "email@email.com",
        "telephone": null,
        "addressId": null,
        "rating": [],
        "createdAt": "actual ISO Date"
      }
    ```
  - `/login` (POST) => Sign-in user
    - JSON EXAMPLE
    ```
      {
        "email": "email@email.com",
        "password": "password123"
      }
    ```
    - RESPONSE EXAMPLE
    ```
      {
        "access_token": "jwt token with secret"
      }
    ```
  - `/user` (GET) => Get all users
    - DONE
  - `/user` (PATCH) => ( need jwt )Edit user informations
    - JSON EXAMPLE
    ```
      {
        "name": "new name
        "email": "newemail@email.com",
        "telephone": "210928401283",
        "address": {
          /* if user doesn't have a registered address -> use CREATE
             if the user already has a registered address -> use UPDATE
          */
          "create/update": {
            "street": "your street",
            "number": 123,
            "district": "your district",
            "complement": "your complement",
            "cep": "your zip code",
            "city": "your city",
            "state": "your state"
          }
        }
      }
    ```
  - `/user/` (DELETE) => (need jwt) Delete user
    - DONE
  - `/user/:id` (GET) => Get User Public Data
    - DONE
  - `/user/password` (PATCH) => (need jwt) Update user password
    - JSON EXAMPLE
    ```
      {
        "currentPassword": "user password",
        "newPassword": "user new password"
      }
    ```
  - `/user/password/requestreset` (PATCH) => send a email to reset user password
    - JSON EXAMPLE
    ```
      {
        "email": "your@email.com"
      }
    ```
    - RESPONSE
    ```
      return the link to reset password by email
    ```
  - `/user/password/reset` (PATCH) => (need token received by email) reset user password
    - JSON EXAMPLE
    ```
      {
        "id": "user id",
        "password": "new password",
        "token": "token received in email link"
      }
    ```
  - `/user/:id/rating` (POST) => (need jwt and buy from user) send a rating to the user
    - JSON EXAMPLE
    ```
      {
        "rating": number (1 - 5),
      }
    ```
  - `/user/:username/relatory` (GET) => (need jwt) monthly user relatory
    - TODO
  - `/user/:username/selling` (GET) => user items for sale   
    - TODO
  - `/user/:username/cart` (GET) => Get user cart items
    - TODO
  - `/user/:username/cart` (POST) => add item to user cart
    - DONE
  - `/user/:username/cart` (DELETE) => Delete item from user cart
    - TODO
  - `/user/:username/favs` (GET) => Get all user fav posts
    - DONE

# MARKETPLACE

  - `/create` (POST) => Create sale product
    - TODO
  - `/market` (GET) => Get all market items
    - TODO
  - `/market/:id` (PATCH) => edit sale product
    - TODO
  - `/market/:id` (GET) => Get sale product
    - TODO
  - `/market/:id/rating` (POST) => (need jwt and buy) send a rating to the product
    - TODO
  - `/market/:id/comment` (POST) => (need jwt and buy) create a comment on the product
    - TODO
  - `/market/:id/comment` (GET) => Get product comments
    - TODO
  - `/market/:id/comment/:id` (PATCH) => edit product comment
    - TODO
  - `/market/:id/comment/:id` (DELETE) => Delete product comment
    - TODO
  - `/market/:id/buy` (POST) => (need jwt) buy item from product
    - TODO
  - `/market/:id/report` (POST): Report product
    - TODO
  - `/market/:id/fav` (POST) => add product to user favs
    - TODO

# SEARCH

  - `/api/search/users` (GET) => Search users
    - DONE
  - `/api/search/products` (GET) => Search products
    - DONE

## TABLES 

# PRODUCT

  - ID
  - name
  - description
  - manufacturing_date
  - expiration_date
  - quantity
  - price (FK)
  - created_at

# PRODUCER

  - ID
  - name
  - email
  - telephone (FK)
  - address (FK)
  - P.F. or P.J. (inheritance)

# CLIENT

  - ID
  - name
  - email
  - address (FK)
  - telephone (FK)
  - purchases
  - sales

# ORDER

  - ID
  - create_at
  - value
  - payment_method

# BUY

  - ID
  - product (FK)
  - order (FK)
  - quantity

# SALE

  - ID
  - product (FK)
  - producer (FK)
  - order (FK)
  - quantity 

# ADDRESS 
 
  - ID
  - street
  - number
  - district
  - cep
  - complement
  - producer (FK)
  - client (FK)

# TELEPHONE

  - ID
  - ddd
  - number
  - type
  - producer (FK)
  - client (FK)
