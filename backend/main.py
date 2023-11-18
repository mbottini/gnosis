import sqlite3 as sql 
from flask import * 
from bcrypt import gensalt
from hashlib import md5 
from flask_cors import CORS

pwHash = lambda pw: str(int(md5(pw.encode('utf-8')).hexdigest(), 16))

app = Flask(__name__)
CORS(app)

@app.route('/create/tracker', methods=['POST'])
def createTracker(dbConn, student_id, carton_id, card_type_id, deck_id):
    cur = dbConn.cursor()
    cur.execute("INSERT INTO tracker (student_id, carton_id, card_type_id, deck_id) VALUES (?, ?, ?, ?)", (student_id, carton_id, card_type_id, deck_id))
    dbConn.commit() # Does this (and the jsonify return) need to be here, given that we're mostly (only?) creating trackers underCreateCarton?
    return jsonify(''), 200

@app.route('/create/carton/', methods=['POST'])
def createCarton(dbConn, template_id, fields, classroom_id, deck_id):
    cur1 = dbConn.cursor()
    cur1.execute("INSERT INTO carton (template_id, fields) VALUES (?, ?)", (template_id, fields))
    carton_id = cur1.lastrowid  # Get the carton ID
    
    cur2 = dbConn.cursor()
    cur2.execute("SELECT student_id FROM student WHERE classroom_id = ?", (classroom_id))
    allStudents = cur2.fetchall()
    
    cur3 = dbConn.cursor()
    cur3.execute("SELECT card_type_id FROM template WHERE template_id = ?", (template_id))
    allCardTypes = cur3.fetchall()

    cur4 = dbConn.cursor()
    for cardType in allCardTypes:
        cur4.execute("INSERT INTO card (card_type_id, carton_id, deck_id) VALUES (?, ?)", (cardType[0], carton_id, deck_id))
        for student in allStudents:
            createTracker(dbConn, student[0], carton_id, cardType[0], deck_id)  # Pass the carton ID

    dbConn.commit()
    return jsonify(''), 200

@app.route('/create/card_type', methods=['POST'])
def createCardType(dbConn, template_id, card_type_name, frontSide, backSide):
    cur = dbConn.cursor()
    cur.execute("INSERT INTO card_type (template_id, card_type_name, frontSide, backSide) VALUES (?, ?, ?, ?)", (template_id, card_type_name, frontSide, backSide))
    dbConn.commit()
    return jsonify(''), 200

@app.route('/create/deck', methods=['POST'])
def createDeck(dbConn, deck_name, course_id):
    cur = dbConn.cursor()
    cur.execute("INSERT INTO deck (deck_name, course_id) VALUES (?, ?)", (deck_name, course_id))
    dbConn.commit()
    return jsonify(''), 200

@app.route('/update/deck/<deck_id>', methods=['PUT']) # Is this the right way to do this?
def transferDeckToNewCourse(dbConn, deck_id, new_course_id):
    cur = dbConn.cursor()
    cur.execute("UPDATE deck SET course_id = ? WHERE deck_id = ?", (new_course_id, deck_id))
    dbConn.commit()
    return jsonify(''), 200