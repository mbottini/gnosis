import datetime

from django.db import models
from django.forms import ModelForm
from django.core.exceptions import ObjectDoesNotExist

from django.utils import timezone
from django_jsonform.models.fields import JSONField

from django.template import Template as DjTemplate, Context

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


def get_factset_schema(instance=None):
    try:
        return instance.schema.get_schema()
    except (ObjectDoesNotExist, AttributeError): #attr error for instance=None
        return {
            'type': 'dict',
            'keys': {},
            'additionalProperties': { 'type': 'string' },
        }


class FactSet(models.Model):
    facts = JSONField(schema=get_factset_schema)
    name = models.CharField(max_length=50, blank=True)

    templates = models.ManyToManyField("Template", through='Card')
    schema = models.ForeignKey("FactSetSchema", on_delete=models.CASCADE)

    def __str__(self):
        return f"FactSet {self.name}"

class FactSetSchema(models.Model):
    ITEMS_SCHEMA = {
        'type': 'array',
        'items': {
            'type': 'string'
        }
    }
    schema = JSONField(schema=ITEMS_SCHEMA)
    name = models.CharField(max_length=50)

    def get_schema(self):
        schema = {
            'type': 'dict',
            'keys': {},
            'additionalProperties': {'type': 'string'},
        }
        for field in self.schema:
            schema['keys'][field] = {'type': 'string'}
        return schema

    def __str__(self):
        return f"FieldCollection {self.id}"


class Template(models.Model):
    name = models.CharField(max_length=50, default="Template")
    front = models.TextField()
    back = models.TextField()
    schema = models.ForeignKey(FactSetSchema, on_delete=models.CASCADE)
    default = models.BooleanField(default=True,) #default create a  card for each factset with this template

    def __str__(self):
        return f"Template {self.id}"


class Card(models.Model):
    fact_set = models.ForeignKey(FactSet, on_delete=models.CASCADE)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)

    def render_side(self, side):
        t = DjTemplate(getattr(self.template, side))
        rendered_content = t.render(Context(self.fact_set.facts))
        return rendered_content

    def render_front(self):
        return self.render_side("front")

    def render_back(self):
        return self.render_side("back")



    def __str__(self):
        return f"Card {self.id} (FactSet {self.fact_set.name} - Template {self.template.id})"


class Deck(models.Model):
    cards = models.ManyToManyField(Card)
    subdecks = models.ManyToManyField('self', symmetrical=False)
    name = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return f"Deck {self.name}"
