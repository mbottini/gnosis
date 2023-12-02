class School:
    def __init__(self, name, IDNum):
        self.name = name
        self.IDNum = IDNum

class Teacher:
    def __init__(self, name, IDNum, School):
        self.name = name
        self.IDNum = IDNum
        self.School = School

class Student:
    def __init__(self, name, IDNum):
        self.name = name
        self.IDNum = IDNum

class Course:
    def __init__(self, name, IDNum, Teacher, School, Students):
        self.name = name
        self.IDNum = IDNum
        self.Teacher = Teacher
        self.School = School
        self.Students = Students

    def addStudent(self, Student):
        self.Students.append(Student)

    def removeStudent(self, Student):
        self.Students.remove(Student)

class Deck:
    def __init__(self, name, IDNum, school, course):
        self.name = name
        self.IDNum = IDNum
        self.school = school
        self.course = course

class Template:
    def __init__(self, fields, cardTypes):
        self.fields = fields
        self.cardTypes = cardTypes

class CardType:
    def __init__(self, frontFace, backFace, template):
        self.frontFace = frontFace
        self.backFace = backFace
        self.template = template

class Face:
    def __init__(self, fields, htmlBlob):
        self.fields = fields
        self.htmlBlob = htmlBlob
