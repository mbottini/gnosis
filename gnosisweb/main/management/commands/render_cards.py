from main.models import FactSet, Template, Carton
from django.core.management.base import BaseCommand, CommandError
from django.template import Context, Template



class Command(BaseCommand):
    help = "renders all the cartons in the db"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        for c in Carton.objects.all():
            c.render()
