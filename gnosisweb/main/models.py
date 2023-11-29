import datetime

from django.db import models
from django.forms import ModelForm

from django.utils import timezone


# class SchoolAdmin(models.Model):
#     username = models.CharField(max_length=50)
#     password = models.CharField(max_length=50) #Make sure this gets hashed, salted, etc. later
#     salt = models.CharField(max_length=50) #idk why this is here other than toto did it

#     def __str__(self):
#         return self.username #can we have it return the ID instead?

# class School(models.Model):
#     name = models.CharField(max_length=50)
#     admin = models.ForeignKey(SchoolAdmin, on_delete=models.CASCADE)

#     def __str__(self):
#         return self.name

# class Student(models.Model):
#     username = models.CharField(max_length=50)
#     password = models.CharField(max_length=50)
#     salt = models.CharField(max_length=50)
#     school = models.ForeignKey(School, on_delete=models.CASCADE)

#     def __str__(self):
#         return self.username

# class Teacher(models.Model):
#     username = models.CharField(max_length=50)
#     password = models.CharField(max_length=50)
#     salt = models.CharField(max_length=50)
#     school = models.ForeignKey(School, on_delete=models.CASCADE)

#     def __str__(self):
#         return self.username

# class Course(models.Model):
#     name = models.CharField(max_length=50)
#     teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
#     students = models.ManyToManyField(Student) #Are we doing it this way?

#     def __str__(self):
#         return self.name

# class Deck(models.Model):
#     name = models.CharField(max_length=50)
#     course = models.ForeignKey(Course, on_delete=models.CASCADE)

#     def __str__(self):
#         return self.name

class FactSet(models.Model):
    facts = models.JSONField()
    templates = models.ManyToManyField("Template", through='Carton')

    def __str__(self):
        return f"FactSet {self.id}"

class Template(models.Model):
    front = models.TextField()
    back = models.TextField()

    def __str__(self):
        return f"Template {self.id}"

class Carton(models.Model):
    fact_set = models.ForeignKey(FactSet, on_delete=models.CASCADE)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)

    def render(self):
        from django.template import Context, Template
        print("****")
        print("front:")
        print(Template(self.template.front).render(Context(self.fact_set.facts)))
        print("back:")
        print(Template(self.template.back).render(Context(self.fact_set.facts)))
        print("****")

    def __str__(self):
        return f"Carton {self.id} (FactSet {self.fact_set.id} - Template {self.template.id})"
