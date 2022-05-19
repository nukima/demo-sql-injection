Install packages

```
npm install
```

Create a .env file in the <b>outside</b> of "views" \
.env

```
DB_PASS=[your database password]
PORT=3000
MY_SECRET=[anything]
```

Create a table students

```
CREATE TABLE Students (
    studentID int,
	FirstName varchar(255),
    LastName varchar(255),
	University Name(255)
);
```

Insert student data

```
INSERT INTO Students VALUES (1234, "Nobita", "Nobi", "PTIT");
```

Create table Users

```
CREATE TABLE Users (
	username varchar(255),
    password varchar(255)
);
```

Insert users data

```
INSERT INTO Users VALUES ("admin", "admin");
```

Run

```
node index.js
```

Go to "http://localhost:3000/" in browser

