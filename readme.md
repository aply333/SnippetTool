# Project Goals: BackEND

- Practice in building, with a focus on handling foreign keys pointed at in a number of directions.
  - Manages:
    - Users
    - Projects
    - Code Syntaxing
    - Code snippet information
  - Uses Knex and ExpressJs
- Learn to use O-Auth to manage users, and access control.

## MVP Goals

- Be able to quickly and sercurely access code data.
- Track Data Changes.
- Ensure that data is organized as intended.

---

Logs Table:

1. [January 30th](#jan30th) : Accesing Data for display.
2. [January 29th](#jan29th) : Building Encryption.
3. [January 28th](#jan28) : Builing Users Model.
4. [January 24th ](#jan24): Building Base Database.

---



### <a name="jan30th">January 30, 2021</a>

- Created Two new routes:
  - `at/:username/projects/:user_id`:
    - With a given user_id paramater it will query the database and return all the projects attached to said user.
  - `at/:username/projects/:user_id/:project_id`:
    - With the project_id parameter it will query and return all the code sections attached to said project.
    - It has a validation check: 
      - It will query backwards the project_id to find its associatated user_id.
      - If the user_id param does not match the reverse search, server will return with an unauthorized table error.
- New Models were created to help with users function. They are kept in  `projectModels.js`.
  - `queryUserProjects(user_id)`:
    - takes in a user id, and will return all the projects attached to said user.
  - `queryProjectsID(project_id)`:
    - Will return the user/s that are attached to a given project.
  - `queryProjectCode(project_id)`:
    - Will take the project_id and return all the code pages associated with given Project.
- Began moving state to Redux:
  - `user_data` is now being stored in redux store rather locked in login.
    - `data`:
      1. `didAgree`: 1 = true, 0 = false: _Should never be false._
      2. `name`: string of user's name.
      3. `user_email`: string of user's email.
      4. `user_id`: this is the Id that it matched up in the database.
      5. `username`: the accounts name, this Is what is allowed to be publicly visible.

### <a name="jan29th">January 29, 2021</a>

- Put work with passport to the side, and decided to use JSONwebtokens.
- `bcryptjs` & `jsonwebtoken`: Password hashing and authentication completed.
  - `authRoutes`: This contains the routes for logging in and registering.
    - `.route("/login")`:
      - From body data it will take an `email` and `key`.
      - It will then next search the database for a matching user with said email: `findUser(email)`.
        - If not found a `status(404)` will be returned, this is done in the outside `try`and `catch`.
      - Next, `keyCheck` is declared, which will run bcrypt to return a true or false, depending if the password matches the hash stored in the database.
        - If valid, a session token will be sent to the client.
        - Else,  a `status(401)` is sent stating the password is invalid.
    - `.route("/register")`:
      - Stores `req.body` in the `new_user` variable.
      - Then it will take the key given in `new_user`, hash it, then reassign it to the `new_user`.
      - Next, there is a check on the `new_user` data, using the `validUserData()` function.
      - Finally, it will insert the new user into the database:
        - On success will return the send the client the user data with a `satus(201)`
        - On fail it will console log the error.
  - `tokenGenerate()`: Takes one argument, a user object. 
    - Using the user object it will generate a token to use in authorization.
    - Each session will last for two hours.
  - `auth_middleware`: This is middleware to be used on the `userRoutes`.
    - This will grab a token from the request.
    - If the tocken does not match it will return a `status(401)`, and respond with an unmatched messege.
    - If the tocken is not found, it will return a `status(401)` and respond with a "Please log-in." messege.
- Code has been cleaned a bit.
  - Moved authentication to its own routes and folder.
  - Created folders to store all internal routes. Code to be brocken into matching front end components.

---



### <a name="jan28">January 28, 2021</a>

- Created `userModel.js`:
  - `findUser(email)`: 
    - SELECT * WHERE user_email = email
    - returns the user where the email matches input.
  - `registerUser(user)`:
    - Takes a json object:
      - Email, username, name, didAgree.  Password to be connected, once bcrytp is incorperated. 
- Created `validUserData(user_data)`:
  - Takes one argument `user_data`, this should be the posted data provided from `req.body`.
  - This will check that every piece of data, that is needed, is there and is the correct data type.
    - Name, username, email are all strings and cannot be empty strings.
    - didAgree, must be true to be processed.

___



### <a name="jan24">January 24, 2021</a>

- Settup a basic Express Server, pings when `localhost:5000` is called in browser.

- Initialized and assembled Knex Database, with use of SqlLite3.

  - There are six tables in use:
    - Users:
      - This is set up temporarily, when O-Auth is incorporated will be updated.
      - Currently takes email, username and generates an incrementing `user_id`.
    - Projects: 
      - `project_id`: auto incrementing id.
      - `project_id`: Takes a text string, max cap of 128 characters.
      - `date_project_created`: Stores when the project was created.
      - `date_project_changed`: Stores whent he project was last edited.
    - Code:
      - Well, maybe not the best name, as I code I can see that this tool I'm building can be used for other things, but well I'm in and rather use my time builiding out fuctionality at this point.
      - `code_id`: Auto incrementing id.
      - `code_title`: Title for code section.
      - `date_code_created`: Stores when this code bit was created.
      - `date_code_changed`: Stores when this code was last edited.
      - `project`: Foreign key, references which project it is a part of.
    - Tag:
      - This is used to manage colors/highlighting of snippets.
      - `tag_id`: Auto incrementing id.
      - `tag_text`: Text string, <u>optional,</u> gives a tag a name, and is intended for when a tag is use between multiple code sections.
      - `tag_color`: <u>This is mandatory</u>, this makes the visible connection between code points and snippets.
    - Lines:
      - Stores each line, thinking about how to handle parsing of code, I decided to make each line its own entry into a table. This way, editing lines after creation will be more manageable, rather than having to create a new entry for each edit made.
      - `line_id`: Auto incrementing id.
      - `line_position`: This is will tell the order that the lines apear in, I assume not neccissary but I can see bugs arrising where the order loads out of sync and this can be used as a fail-safe.
      - `tag`: Foreign Key, telling us if and to what it was taged to. Will correspond to a matching key for the `Snippet` Table.
      - `code`: Foreign Key, telling us which code project/sample, this is a part of.
      - `line_date_created`: Stores when the line was added.
      - `line_date_changed`: Stores when the line was last updated.
      - `line_data`: Contains the auctual data of said line, it's a text string.
    - Snippet:
      - This contains notes made for its corresponding line, if there is one.
      - `snippet_id`: Auto incrementing id.
      - `position`: Same use as lines, to ensure displayed order on front-end is accurate.
      - `snippet_title`: Title for the given snippet.
      - `snippet_data`: Text string on what is to be told about that line of code.
      - `tag`: Foreign Key, connecting tag and color to snippet. Should always match to the corresponding line, within line-table.
      - `line_reference`: Foreign key, connecting to which Line it is references.
      - `code_reference`: Foreign key, connecting it to which code section it is a part of.

- Corresponding seed data has been created, all can be called in SqliteStudio and found accordingly

  

  ---

  ### Next Step

  - Create Data-Base Helpers.
    - Now that the base data and tables are made, I need to create helpers that will collect data in an organized fashion.
    - Need to create the appropriate helpers for each component that will be displayed on the Front - End.
  - ~~Incorporate O-Auth:~~
    - ~~Hesitant on putting this high on the priority list, for development life may be simpler to put it off till I get a portion of the front-end complete.~~
      - ~~In past expeiriences it can create a headache trying to simply just see the exchange of data.~~
    - Decided to work with webtokens, more familiar and have a deadline in mind.

---

### External Resources used:

1. ExpressJs
2. Knex
3. Nodemon
4. Sqlite3
5. Bcrypt
6. CORS
7. JSONWebtoken