from main.models import FactSet, Template, Card
from django.core.management.base import BaseCommand, CommandError
from django.template import Context, Template



class Command(BaseCommand):
    help = "renders all the Cards  in the db"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        for c in Card.objects.all():
            c.render()
