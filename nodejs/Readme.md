Develop an application that uses nodejs and mongodb to manage a football tournament.

You have to create the endpoints given below with JWT token authentication.
The passwords should be hashed before saving into the DB.

Collections:
There are four collections namely admin.js, teams.js and players.js that should resides inside src\db\models. The schema for those collections are given below

admin - _id(ObjectID, Auto generated), name(String, length should be greater than 3, required), password(String, should be hashed before storing, required), tokens(Array of objects, each objest should has the following properties -> _id(ObjestID, Auto generated), token(JWT token)), __v(Number, Auto generated)(There will be only one admin and his details will be stored inside db for testing)

teams - _id(ObjectID, Auto generated), name(String, unique, should contain only alphabets and spaces, length should be greater than 2, required), password(String, should be hashed before storing, length should be greater than 7, required), country(String, unique, should contain only alphabets and spaces, length should be greater than 2, required), coach(String, should contain only alphabets and spaces, length should be greater than 2, required), tokens(Array of objects, each objest should has the following properties -> _id(ObjestID, Auto generated), token(JWT token)), logo(Buffer) __v(Auto generated)

players - _id(ObjectID, Auto generated), name(String, length should be greater than 3, required), age(Number, required), noOfMatches(Number, required), goalsScored(Number, required), type(String, required), belongsTo(ObjectID, foregin key(teams - _id), __v(Number, Auto generated).

mappings - _id(ObjectID, Auto generated), category(String, required), name(String, default: ""), __v(Number, Auto generated).

Middlewares:
There will be two middlewares(auth.js and adminauth.js) that will verify the token created when logged in or registering for the first time and will be used to provide access to the routes if the authentication is successful

For all the routes with authentication if the authentication is unsuccessful, then send { error: "Please authenticate" } as the response with a status code of 400.
While sending the details of an admin or a team as the response remove password and tokens arrays from them.

There are four routers namely admin.js, teams.js players.js and mappings.js that resides inside src\routers. The endpoints that each router should contain is given below,

admin.js:
1)/login - hitting on this route will have to verify the credentials(name and password) of the admin and if valid then an JWT token will be created and concatinated with the tokens array for the admin.

Expected response:
If authenticated successfully:
{ admin, token } 
where admin is the details of the admin and token is the JWT token generated with the login of the admin while hitting that route.

If authentication was failed:
{ message:"Username or Password is wrong" }
with a status code of 400.

2)/admin/teams/delete/:id - this route will have to authenticate the admin using the middleware and will have to delete the team _id sent with the url(it should also delete the players of the team from the DB).

Expected response:
If team is deleted successfully:
{ message:"Team is deleted successfully" }

If deletion is unsuccessful:
send 400(bad request) as the response code.

3)/admin/players/delete/:id - this route will have to authenticate the admin using the middleware and will have to delete the player with _id sent with the url.

Expected response:
If team is deleted successfully:
{message:" Player Deleted Successfully"}

If deletion is unsuccessful:
send 400(bad request) as the response code with error message(if any).

4)/admin/teams/view - this route will have to authenticate the admin using the middleware and will have to fetch all the team details from the DB as the response.

Expected response:
If everything goes well:
teams
where teams is an array of all the team details from the DB.

If something went wrong:
send 500 as the response code with error message(if any).

5)/admin/teams/update/:id - this route will have to authenticate the admin using the middleware and will have to update the details of the team sent with the request. Allowed updates are name, country and coach values.

Expected response:
If update was successful:
team
where team is the updated details of the team.

If update was unsuccessful:
send 400 response back with the error message(if any)

6)/admin/teams/eleven/:id - this route will have to authenticate the admin and will give the playing eleven of the team. _id of the team is sent with the request url.

Expected response:
players details who are all in the playing eleven.

7)/admin/players/view/:id - this route will have to authenticate the admin using the middleware and will have to fetch all the players details from the DB as the response who are all having belongsTo equals _id sent with the request url.

Expected response:
If everything goes well:
players
where teams is an array of all the team details from the DB.

If something went wrong:
send 400(bad request) as the response code with error message(if any).

8)/admin/players/update/:id - this route will have to authenticate the admin using the middleware and will have to update the details of the player whose _id is sent with the request.

Expected response:
If update was successful:
player
where player is the updated details of the player

If update was unsuccessful:
send 400 response back with the error message(if any)

9)/admin/players/register/:id - this route will have to authenticate the admin using the middleware and will have to store the details of the player sent with the request body with belongsTo equals _id sent with the response url.

Expected response:
If player was created successfully:
player
where player is the details of the player created with a response code of 201.

If player is not created:
send 400 response back with the error message(if any)

10)/admin/players/deleteAll/:id - this endpoint will have to authenticate the admin and will have to delete all the players having belongs to equals _id sent with the url.

Expected response:
If the deletion is successful:
{message:"All the players of the team were deleted successfully"}

If something went wrong: 
send 400 respone back with the error message(if any)

teams.js
1)/teams/registration - this route will have to validate the data sent with the request and if valid the JWT token will have to generated and concatinated with the tokesn array of the user detalis storing it inside the teams collection.

Expected response:
If registered successfully:
{ team, token } 
where team is the details of the team and token is the JWT token generated with the registration of the team while hitting that route.(status code of 201 should be sent as the response code)

If team is not registered:
send 400 response back with the error message(if any)

2)/teams/login - hitting on this route will have to verify the credentials(name and password) of the team and if valid then an JWT token will be created and concatinated with the tokens array for the admin.

Expected response:
If authenticated successfully:
{ team, token } 
where team is the details of the team and token is the JWT token generated with the login of the team while hitting that route.

If team is not registered:
send 400 response back with the error message(if any)

3)/teams/update - this route will have to authenticate the admin using the middleware and will have to update the details of the team sent with the request. Allowed updates are name, country and coach values.

Expected response:
If update was successful:
team
where team is the updated details of the team.

If update was unsuccessful:
send 400 response back with the error message(if any)

4)/teams/view - this route will have to authenticate the team using the middleware and will have to fetch all the team details from the DB as the response.

Expected response:
If everything goes well:
teams
where teams is an array of all the team details from the DB.

If something went wrong:
send 500 as the response code with error message(if any).

5)/teams/delete - this route will have to authenticate the team using the middleware and have to delete the user details from the DB. When the team gets deleted the players of the team will also be deleted from the DB

Expected response:
If team gets deleted
{"message":"Team is deleted successfully"}

If team is not deleted:
send 400 response back with the error message(if any)

6)/teams/eleven - this route will have to authenticate the team and will have to get the team eleven if all the needed conditions were met.

Expected response:
If team is having a expected combination:
{message:"",team11s:eleven}
where eleven is the list of players in the team.

If team is not having expected combination:
{message:"Playing eleven does not meets the needed conditions",team11s:eleven}
where eleven is the list of players in the team.

If something went wrong:
send 400 response back with the error message(if any)

players.js
1)/players/register - this route will have to authenticate the team and register details of the player if the data send with the request are valid. The player should have the belongsTo will have the value of _id of the logged in team.

Expected response:
If player was created successfully:
player
where player is the details of the player created with a response code of 201.

If player is not created:
send 400 response back with the error message(if any)

2)/players/update/:id - this route will have to authenticate the team and update details of the player whose _id is sent with the request with the data sent with it.

Expected response:
If update was successful:
player
where player is the updated details of the player

If update was unsuccessful:
send 400 response back with the error message(if any)

3)/players/view - this route will have to authenticate the team and will get the players having belongsTo equals _id of the logged in team.

Expected response:
If everything goes well:
players
where teams is an array of all the team details from the DB.

If something went wrong:
send 400(bad request) as the response code with error message(if any).

4)/players/delete/:id - this route will have to authenticate the team and delete the player _id is sent with the request.

Expected response:
If team is deleted successfully:
{message:" Player Deleted Successfully"}

If deletion is unsuccessful:
send 400(bad request) as the response code with error message(if any).

5)/players/deleteAll - this route will have to authenticate the team and delete the players having belongsTo equals _id of the logged in team.

Expected response:
If the deletion is successful:
{message:"All the players of the team were deleted successfully"}

If something went wrong: 
send 400 respone back with the error message(if any)

mappings.js
1)/mapping/view - this route will have to fetch all the data from mappings collection.

2)/mapping/update/:id - this route will have to authenticate using the adminauth middleware and have to update the name field with the data sent with the request the mapping having _id that comes along with the request url.