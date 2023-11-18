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

--Deck ID may be irrelevant here given that we have a card_id and the card_id is associated with a deck_id. Note that carton_id is NOT irrelevant. When the tracker comes up for review, the machine grabs the carton ID and the card type ID and creates the card from scratch by feeding the data in the carton through the card type
CREATE TABLE IF NOT EXISTS tracker (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    carton_id INTEGER NOT NULL,
    card_type_id INTEGER NOT NULL,
    deck_id INTEGER NOT NULL,
    --Some other keys to un-comment in the future. Cf. https://github.com/ankidroid/Anki-Android/wiki/Database-Structure for what Anki does, though not everything Anki does will be included here
    
    --timeCreated_id INTEGER NOT NULL, --in Anki this is the epoch in milliseconds; is the 2038 problem resolved in this sort of thing by now?
    --timeDue_id INTEGER NOT NULL,
    --interval_id INTEGER NOT NULL, --Probably milliseconds, but rounded to the nearest day (?)
    --queue_id INTEGER NOT NULL, --e.g. 'new', 'learning', 'review', 'buried', 'suspended', we can do this later
    FOREIGN KEY(student_id) REFERENCES student(id),
    FOREIGN KEY(card_id) REFERENCES card(id),
    FOREIGN KEY(carton_id) REFERENCES carton(id),
    FOREIGN KEY(card_type_id) REFERENCES card_type(id),
    FOREIGN KEY(deck_id) REFERENCES deck(id)
);

--Here is an example of how this works in practice: 

--Suppose we have a template for Mandarin vocab that has three topoi under it: a character (e.g. 雨), a pronunciation in Pinyin (yǔ), and an English gloss ('rain').

--This template is for Mr. Smith's Mandarin 1 Class, which has 20 students in it. When Mr. Smith fills in the topoi and presses enter, a carton is created with the three topoi filled in.

--The template also defines three card types, as follows:
--a) given the Chinese character(s), what is its pronunciation?
--b) given the Chinese character(s), what is the English meaning?
--c) given the English gloss, what is the Chinese word, both pronunciation and characters?

--When Mr. Smith presses enter, a card is created for each student in the class for each card type. So if there are 20 students in the class, pressing enter on ('雨', 'yǔ', 'rain') produces 3 *cards* in the card table, but 60 *trackers*: Johnny has a tracker for each of ('pronunciation of 雨' -> 'yǔ'), ('雨' -> 'rain'), ('rain' -> '雨/yǔ'). So does Sally. So does Billy...

--Each tracker looks like:
--*unique trackerID | billyID | ID of the carton  {'char':'雨', 'pinyin':'yǔ', 'gloss':'rain'} | ID of the 'Chinese -> English' card type | [scheduling stuff goes here]. *

--We can also see here that sooner or later we want the ability to put extra stuff into a card type that surrounds the dota, probably in HTML. E.g. 'pronunciation of 雨' and '(meaning of) 雨' take the same *field* on the front but are not the same card.