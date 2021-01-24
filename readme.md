# Project Goals

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

## January 24, 2021

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
  - Incorporate O-Auth:
    - Hesitant on putting this high on the priority list, for development life may be simpler to put it off till I get a portion of the front-end complete. 
      - In past expeiriences it can create a headache trying to simply just see the exchange of data.

---

### External Resources used:

1. ExpressJs
2. Knex
3. Nodemon
4. Sqlite3