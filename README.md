## CULTIVA - SUSTAINABLE E-COMMERCE

WORK IN PROGRESS

## ROUTES (TO DO LIST)

# USER 

  - `/register` (POST) => Create user
    - TODO
  - `/login` (POST) => Sign-in user
    - TODO
  - `/users` (GET) => Get all users
    - TODO
  - `/users/:username` (GET) => Get User Public Data
    - TODO
  - `/users/:username/password` (PATCH) => (need jwt) Update user password
    - TODO
  - `/users/:username/resetpassword` (PATCH) => (email verify) reset user password
    - TODO
  - `/users/:username/profile` (PATCH) => (need jwt) Update user data
    - TODO
  - `/users/:username` (DELETE) => (need jwt) Delete user
    - TODO
  - `/users/:username/report` (POST): Report other user
    - TODO
  - `/users/:username/rating` (POST) => (need jwt and buy from user) send a rating to the user
    - TODO
  - `/users/:username/relatory` (GET) => (need jwt) monthly user relatory
    - TODO
  - `/users/:username/selling` (GET) => user items for sale   
    - TODO
  - `/users/:username/cart` (GET) => Get user cart items
    - TODO
  - `/users/:username/cart` (POST) => add item to user cart
    - TODO
  - `/users/:username/cart` (DELETE) => Delete item from user cart
    - TODO
  - `/users/:username/favs` (GET) => Get all user fav posts
    - TODO

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
    - TODO
  - `/api/search/products` (GET) => Search products
    - TODO

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
