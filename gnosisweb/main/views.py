from django.http import HttpResponse as response
from django.shortcuts import render
from .models import Template, Topos, School, SchoolAdmin, Student, Teacher, Course, Deck

def index(request):
    """View function for home page of site."""

    # Generate counts of some of the main objects
    num_template = Template.objects.all().count()

    all_templates = Template.objects.all()


    context = {
        'num_template': num_template,
        'all_templates': all_templates
    }

    # Render the HTML template index.html with the data in the context variable
    return render(request, 'index.html', context=context)

def makeCarton(request):
    """View function for makeCarton page of site."""

    # Generate counts of some of the main objects
    num_template = Template.objects.all().count()

    all_templates = Template.objects.all()


    context = {
        'num_template': num_template,
        'all_templates': all_templates
    }

    # Render the HTML template index.html with the data in the context variable
    return render(request, 'makeCarton.html', context=context)

from django.views import generic

class TemplateListView(generic.ListView):
    model = Template