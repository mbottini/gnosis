from django.db import models

class SchoolAdmin(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50) #Make sure this gets hashed, salted, etc. later
    salt = models.CharField(max_length=50) #idk why this is here other than toto did it

class School(models.Model):
    name = models.CharField(max_length=50)
    admin = models.ForeignKey(SchoolAdmin, on_delete=models.CASCADE)

class Student(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    salt = models.CharField(max_length=50)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

class Teacher(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    salt = models.CharField(max_length=50)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

class Course(models.Model):
    name = models.CharField(max_length=50)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    students = models.ManyToManyField(Student) #Are we doing it this way?

class Deck(models.Model):
    name = models.CharField(max_length=50)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

class Template(models.Model):
    name = models.CharField(max_length=50)

class Topos(models.Model):
    name = models.CharField(max_length=50)
    rank = models.IntegerField()
    template = models.ForeignKey(Template, on_delete=models.CASCADE)

class Carton(models.Model):
    name = models.CharField(max_length=50)
    topoi = models.ManyToManyField(Topos) # I assume this is correct, but does it need to be a foreign key?
    template = models.ForeignKey(Template, on_delete=models.CASCADE)

# Again I would like a snappy one-word name for card type
class CardType(models.Model):
    name = models.CharField(max_length=50)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    frontSide = models.CharField(max_length=200) #Maybe as HTML, maybe as something else. Probably a char field is entirely inappropriate
    backSide = models.CharField(max_length=200) 

class Card(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    cardType = models.ForeignKey(CardType, on_delete=models.CASCADE)
    carton = models.ForeignKey(Carton, on_delete=models.CASCADE)

class Tracker(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    # Either specified as a combo of a carton and a card type, or as a single card. I am inclined to the former
    carton = models.ForeignKey(Carton, on_delete=models.CASCADE)
    cardType = models.ForeignKey(CardType, on_delete=models.CASCADE)

    #Ignore these, for now
    '''
    lastSeen = models.DateTimeField()
    lastCorrect = models.DateTimeField()
    lastIncorrect = models.DateTimeField()
    lastSeen = models.DateTimeField()
    lastCorrect = models.DateTimeField()
    lastIncorrect = models.DateTimeField()
    '''
    