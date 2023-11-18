from django.http import HttpResponse as response

def index(request):
    return response("Hello, world. You're at the main index.")


# Create your views here.
