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
    
    id = models.AutoField(primary_key=True)
    facts = models.JSONField()

    nameKey = models.CharField(max_length=50, default="Target")

    @property
    def name(self):
        return self.facts[self.nameKey]
    
    templates = models.ManyToManyField("Template", through='Carton')

    @property
    def all_templates(self):
        return self.templates.all()  

    def __str__(self):
        return f"FactSet {self.name}"
    

class FieldCollection(models.Model):
    id = models.AutoField(primary_key=True)

    #Probably we should have this as "header" (='headword/name') followed by "1":, "2":, etc. for every field, or "0" is just the top field, so that we can order the fields. alternatively we just have "field names":[array of field names]. (OTOH, we may want some other system once we want users to be able to restrict the data type in a field)
    allTemplateFields = models.JSONField()

    #We also want to be able to get all the templates spawned by this field collection but, given that field_collection is a foreign key for template, the terminal pops up an ordering error if I try to make migrations


    def __str__(self):
        return f"FieldCollection {self.id}"
    
class Template(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default="Template")
    front = models.TextField()
    back = models.TextField()

    field_collection = models.ForeignKey("FieldCollection", on_delete=models.CASCADE)

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
        return f"Carton {self.id} (FactSet {self.fact_set.name} - Template {self.template.id})"
