import datetime

from django.db import models
from django.forms import ModelForm

from django.utils import timezone

from crispy_forms.helper import FormHelper

class SchoolAdmin(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50) #Make sure this gets hashed, salted, etc. later
    salt = models.CharField(max_length=50) #idk why this is here other than toto did it

    def __str__(self):
        return self.username #can we have it return the ID instead?

class School(models.Model):
    name = models.CharField(max_length=50)
    admin = models.ForeignKey(SchoolAdmin, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Student(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    salt = models.CharField(max_length=50)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    def __str__(self):
        return self.username

class Teacher(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    salt = models.CharField(max_length=50)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    def __str__(self):
        return self.username

class Course(models.Model):
    name = models.CharField(max_length=50)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    students = models.ManyToManyField(Student) #Are we doing it this way?

    def __str__(self):
        return self.name

class Deck(models.Model):
    name = models.CharField(max_length=50)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

#Do we need to rename this given that Django is going to use the term 'template' to refer to webpage stuff?
class Template(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
class TemplateForm(ModelForm):
    class Meta:
        model = Template
        fields = "__all__"

class Topos(models.Model):
    name = models.CharField(max_length=50)
    rank = models.IntegerField()
    template = models.ForeignKey(Template, on_delete=models.CASCADE)

    def __str__(self):
        return self.name 

class Carton(models.Model):
    name = models.CharField(max_length=50) # This is going to need to be something else, probably the doton in a 'main' topos
    dota = models.ManyToManyField(Topos) # I assume this is correct, but does it need to be a foreign key?
    template = models.ForeignKey(Template, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# Again I would like a snappy one-word name for card type
class CardType(models.Model):
    name = models.CharField(max_length=50)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    frontSide = models.CharField(max_length=200) #Maybe as HTML, maybe as something else. Probably a char field is entirely inappropriate
    backSide = models.CharField(max_length=200) 

    def __str__(self):
        return self.name

class Card(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    cardType = models.ForeignKey(CardType, on_delete=models.CASCADE)
    carton = models.ForeignKey(Carton, on_delete=models.CASCADE)

class Tracker(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    # Either specified as a combo of a carton and a card type, or as a single card. I am inclined to the former

    #We maybe put regex stuff here, maybe also in Card and Deck (?)
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
    