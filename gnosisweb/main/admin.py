from django.contrib import admin
from .models import FactSet, Template, Carton, FactSetSchema
from django.forms import ModelForm

#admin.site.register(FactSet)
#admin.site.register(Template)
#admin.site.register(Carton)



class FactSetForm(ModelForm):
    """ Support for dynamic schemas in django-jsonform requires passing the instance in
    post init
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # manually set the current instance on the widget, to support dynamic schema
        try:
            #self.fields['facts'].widget.instance = None
            self.fields['facts'].widget.instance = self.instance
        except:
            pass

class FactSetInline(admin.StackedInline):
    model = FactSet
    form = FactSetForm
    extra = 0


class CartonInline(admin.StackedInline):
    model = Carton



@admin.register(FactSetSchema)
class FactSetSchemaAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')
    inlines = [
        FactSetInline,
    ]


@admin.register(FactSet)
class FactSetAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')
    form = FactSetForm
    inlines = [
        CartonInline,
    ]

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')
    inlines = [
        CartonInline,
    ]

@admin.register(Carton)
class CartonAdmin(admin.ModelAdmin):
    list_display = ('template', 'fact_set', 'id')
