from django.contrib import admin
from .models import FactSet, Template, Carton


#admin.site.register(FactSet)
#admin.site.register(Template)
#admin.site.register(Carton)


# Register your models here.

@admin.register(FactSet)
class FactSetAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')

@admin.register(Carton)
class CartonAdmin(admin.ModelAdmin):
    list_display = ('template', 'fact_set', 'id')