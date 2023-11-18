CREATE TABLE IF NOT EXISTS school_admin (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    passwd BLOB NOT NULL,
    salt BLOB NOT NULL
)

CREATE TABLE IF NOT EXISTS school (
    id INTEGER PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    school_name TEXT NOT NULL,
    FOREIGN KEY(admin_id) REFERENCES school_admin(id)
);

CREATE TABLE IF NOT EXISTS student (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    passwd BLOB NOT NULL,
    salt BLOB NOT NULL,
    school_id INTEGER NOT NULL,
    FOREIGN KEY(school_id) REFERENCES school(id)
);

CREATE TABLE IF NOT EXISTS teacher (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    passwd BLOB NOT NULL,
    salt BLOB NOT NULL,
    school_id INTEGER NOT NULL,
    FOREIGN KEY(school_id) REFERENCES school(id)
);

CREATE TABLE IF NOT EXISTS course (
    id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    teacher_id INTEGER NOT NULL,
    school_id INTEGER NOT NULL,
    FOREIGN KEY(teacher_id) REFERENCES teacher(id),
    FOREIGN KEY(school_id) REFERENCES school(id)
);

CREATE TABLE IF NOT EXISTS deck (
    id INTEGER PRIMARY KEY,
    deck_name TEXT NOT NULL,
    course_id INTEGER NOT NULL,
    FOREIGN KEY(course_id) REFERENCES course(id)
);

CREATE TABLE IF NOT EXISTS template (
    id INTEGER PRIMARY KEY
);

--A topos is a field within a template. It is filled with a 'doton' (usually text, maybe an image). A set of filled-in topoi get shipped off to a carton upon pressing enter in the card maker
CREATE TABLE IF NOT EXISTS topos (
    id INTEGER PRIMARY KEY,
    topos_name TEXT NOT NULL,
    template_id INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    FOREIGN KEY(template_id) REFERENCES template(id)
);

--A collection of dota that are used to fill in topoi
CREATE TABLE IF NOT EXISTS carton (
    id INTEGER PRIMARY KEY,
    template_id INTEGER NOT NULL,
    fields JSON NOT NULL,
    FOREIGN KEY(template_id) REFERENCES template(id)
);

CREATE TABLE IF NOT EXISTS card_type (
    id INTEGER PRIMARY KEY,
    card_type_name TEXT NOT NULL,
    template_id INTEGER NOT NULL,
    frontSide JSON NOT NULL, --maybe this is JSON, maybe it's some sort of HTML thing represented (as text?)
    backSide JSON NOT NULL,
    FOREIGN KEY(template_id) REFERENCES template(id)
);

CREATE TABLE IF NOT EXISTS card (
    id INTEGER PRIMARY KEY,
    card_type_id INTEGER NOT NULL,
    carton_id INTEGER NOT NULL,
    deck_id INTEGER NOT NULL,
    FOREIGN KEY(card_type_id) REFERENCES card_type(id),
    FOREIGN KEY(carton_id) REFERENCES carton(id),
    FOREIGN KEY(deck_id) REFERENCES deck(id)
);

CREATE TABLE IF NOT EXISTS tracker (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    carton_id INTEGER NOT NULL,
    card_type_id INTEGER NOT NULL,
    deck_id INTEGER NOT NULL,
    FOREIGN KEY(student_id) REFERENCES student(id),
    FOREIGN KEY(card_id) REFERENCES card(id),
    FOREIGN KEY(carton_id) REFERENCES carton(id),
    FOREIGN KEY(card_type_id) REFERENCES card_type(id),
    FOREIGN KEY(deck_id) REFERENCES deck(id)
);

