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

1. [February 8th](#feb8) : New Routes, New Models
2. [February 4th](#feb4) : Table Restructure & New Routes
3. [January 30th](#jan30th) : Accesing Data for display.
4. [January 29th](#jan29th) : Building Encryption.
5. [January 28th](#jan28) : Builing Users Model.
6. [January 24th ](#jan24): Building Base Database.

---

### <a name="feb8">February 8th 2021</a>:

- New Routes in the `postRoutes.js` file:
  - The root for these routes are `/postat/:username`
  - This route is protected.
    - `/projects/:user_id`:
      - Takes the project_title from the body.
      - On success return `res.status(201).json(new_table)`
      - On fails response will return the error with and inform weather it happend on the route or in the SQL statements.
    - `/code/:project_id`:
      - Takes the code_title and description from the body.
      - On success return `res.status(201).jsone(new_table)`
      - On fails response will return the error with and inform weather it happend on the route or in the SQL statements.
    - `/snippet`
      - This one is still work in progress.
      - Need to find how to pull a newlly created id from the database.

### New Models:

#### Insert New Project:

```javascript
async function insertNewProject(user_id, project_title) {
  // INSERT NEW PROJECT WITH ASSOCIATED USER.
  try {
    await db("Projects").insert({
      project_title: project_title,
      date_project_created: genearteDate(),
      date_project_changed: genearteDate(),
      user: Number(user_id),
    });
  } catch (err) {
    return { error: "internal sql error", details: err };
  }
  const new_table = await queryUserProjects(user_id);
  return new_table;
}
```

- Takes user_id and the project title.
- Generates a date of creation.
- Will insert the new project to the project table and associat it with the relevant user.

#### Insert New Code:

```javascript
async function insertNewCode(project_id, title, desc) {
  // INSERT NEW CODE PAGE TO A PROJECT IN THE CODE TABLE
  try {
    await db("Code").insert({
      code_title: title,
      raw_code: "#enter code here",
      description: desc,
      date_code_created: genearteDate(),
      date_code_changed: genearteDate(),
      project: Number(project_id),
    });
    const code_table = await queryProjectCode(project_id);
    return code_table;
  } catch (err) {
    return { error: "Internal SQL Error", details: err };
  }
}
```

- Takes project_id, title and description.
- Generates a date of creation
- Will insert the new code section and connect it to the relevent project.

#### Insert New Marker:

```javascript
async function insertNewMarker( marker_object) {
    // INSERT NEW MARKER TO MARKER TABLE.
    try{
        await db('Marker').insert({
            startRow: Number(marker_object.startRow),
            startCol: Number(marker_object.startCol),
            endRow: Number(marker_object.endRow),
            endCol: Number(marker_object.endCol),
            tag: Number(marker_object.tag_id),
            code: Number(marker_object.code_id),
            marker_date_created: genearteDate(),
            marker_date_changed: genearteDate()
        })
        const marker_table = await queryProjectMarker(marker)
        return marker_table
    }catch(err){
        return({error: "Internal SQL Error", details: err})
    }
}

```

- Takes an object: and it is expected to have.
  - startRow, startCol, endRow, endCol => marks the positon of the marker.
  - tag_id ,code_id => connects to relevant tables.
- Generates a date of creation.
- returns a new table with the new posting.

#### Insert New Snippet:

```javascript
async function insertNewSnippet( snippet_object, marker_id ){
    // INSERT NEW SNIPPET TO SNIPPET TABLE
    try{
        await db("Snippet").insert({
            snippet_title:snippet_object.title,
            snippet_data: snippet_object.description,
            tag: snippet_object.tag_id,
            marker_reference: marker_id,
            code_reference: snippet_object.code_id
        })
        const snippet_table = await queryProjectSnippets(snippet_object.code_id)
        return snippet_table
    }catch(err){
        return {error: "Internal SQL error.", details: err}
    }
}
```

- Takes an object: Must have.
  - Title, description, tag_id, and code_id.
- Takes marker_id:
  - This one is tricky, marker_id is not know until it is auctually created.
  - This means it will need to be optained after the marker was posted.

#### Other: `generateDate()`:

```javascript
function genearteDate() {
  let today = new Date();
  let date = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;
  return date;
}
```

This will generate the current date, and also format it accordingly.

`day-month-year`

The return value will be a string.

---



### <a name="feb4">February 4th 2021</a>

- Table Restructure:
  - After working more on the front end, I saw more on how I will need the data to behave.
    - `Lines` table has been removed.
      - Editor content will now be carried within the `Code` table.
      - It is stored in the `raw_code` value, this has a cap of 2048 characters.
    - `Marker`: A new table was created in lines place.
      - `marker_id`: Auto incrementing Id.
      - `startRow`&`startCol`: Where a marked region will begin.
      - `endRow`&`endCol`: Where a marked region will end.
      - `tag`: references tag color, with or without their tag name.
      - `marker_date_created`&`marker_date_changed`: relevant date values for marker.
  - Seed Data has been updated to reflect the changes.
    - For `raw_code`: in the root there is a file of exported modules called `seedData`.
      - This contains the sample code to be seeded in, and is there just to keep the files easier to read.
- New Queries & Rouetes:
  - `queryProjectMarker(code_id)`: Returns table of markers relevant to code_id provided.
  - `queryProjectSnippets(code_id)`: Return table of relevant snippets to code_id.
  - `router.route("/projects/:user_id/:project_id/marker/:code_id")`
    - The bridges `queryProjectMarker(c)`: to the client.
  - `router.route("/projects/:user_id/:project_id/snippet/:code_id")`
    - Bridges `queryProjectSnippet(c):` to client.

> Both of these routes reuse the authorization checks used in the project route, `id_match`.
>
> I may want to change this, and make relevant checks but maybe overkill and just cost at performance.

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
    - ~~Lines:~~ *Refactored, replaced by markers on February 4th.*
      - ~~Stores each line, thinking about how to handle parsing of code, I decided to make each line its own entry into a table. This way, editing lines after creation will be more manageable, rather than having to create a new entry for each edit made.~~
      - ~~`line_id`: Auto incrementing id.~~
      - ~~`line_position`: This is will tell the order that the lines apear in, I assume not neccissary but I can see bugs arrising where the order loads out of sync and this can be used as a fail-safe.~~
      - ~~`tag`: Foreign Key, telling us if and to what it was taged to. Will correspond to a matching key for the `Snippet` Table.~~
      - ~~`code`: Foreign Key, telling us which code project/sample, this is a part of.~~
      - `~~line_date_created`: Stores when the line was added.~~
      - ~~`line_date_changed`: Stores when the line was last updated.~~
      - ~~`line_data`: Contains the auctual data of said line, it's a text string.~~
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