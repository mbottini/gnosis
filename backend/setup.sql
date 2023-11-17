CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    passwd BLOB NOT NULL,
    salt BLOB NOT NULL
)

CREATE TABLE IF NOT EXISTS school (
    id INTEGER PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    school_name TEXT NOT NULL,
    FOREIGN KEY(admin_id) REFERENCES admin(id)
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

CREATE TABLE IF NOT EXISTS template (
    id INTEGER PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS topos (
    id INTEGER PRIMARY KEY,
    topos_name TEXT NOT NULL,
    template_id INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    FOREIGN KEY(template_id) REFERENCES template(id)
);

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
    FOREIGN KEY(template_id) REFERENCES template(id)
);

CREATE TABLE IF NOT EXISTS tracker (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    carton_id INTEGER NOT NULL,
    card_type_id INTEGER NOT NULL,
    FOREIGN KEY(student_id) REFERENCES student(id),
    FOREIGN KEY(course_id) REFERENCES course(id),
    FOREIGN KEY(carton_id) REFERENCES carton(id),
    FOREIGN KEY(card_type_id) REFERENCES card_type(id)
);

