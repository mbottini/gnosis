from django.http import HttpResponse as response
from django.shortcuts import render, get_object_or_404
from django.http import Http404

from django.views.generic import DetailView
from .models import Deck, Tracker, Card

class DeckDetailView(DetailView):
    model = Deck
    template_name = 'deck_detail.html'
    context_object_name = 'deck'

def start_quiz(request, deck_id):
    deck = get_object_or_404(Deck, pk=deck_id)
    next_card = deck.cards.first()
    return render(request, "card.html", {"card": next_card, "deck": deck})

def track_result_new_card(request, deck_id, card_id):
    deck = get_object_or_404(Deck, pk=deck_id)
    card = deck.cards.get(id=card_id)
    if not card:
        raise Http404
    Tracker.objects.create(deck=deck, card=card, result="all good!")
    next_card = deck.get_next_card()
    if next_card:
        return render(request, "card.html", {"card": next_card, "deck": deck})
    else:
        return render(request, "quiz_done.html")




#from .models import Template, Topos, School, SchoolAdmin, Student, Teacher, Course, Deck, TemplateForm, Carton

# def index(request):
#     """View function for home page of site."""

#     # Generate counts of some of the main objects
#     num_template = Template.objects.all().count()
#     all_templates = Template.objects.all()



#     context = {
#         'num_template': num_template,
#         'all_templates': all_templates
#     }

#     # Render the HTML template index.html with the data in the context variable
#     return render(request, 'index.html', context=context)

# def getTopoi(request):
#     myTemplate = request.POST.get('templateOptions')
#     all_topoi = Topos.objects.filter(template= myTemplate)

#     context = {
#         'all_topoi': all_topoi
#     }
#     return render(request, 'getTopoi.html', context=context)

# def makeCarton(request):
#     """View function for makeCarton page of site."""

#     # Generate counts of some of the main objects
#     num_template = Template.objects.all().count()

#     all_templates = Template.objects.all()


#     context = {
#         'num_template': num_template,
#         'all_templates': all_templates
#     }

#     # Render the HTML template index.html with the data in the context variable
#     return render(request, 'makeCarton.html', context=context)

# from django.views import generic

# class TemplateListView(generic.ListView):
#     model = Template
