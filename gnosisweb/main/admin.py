from django.contrib import admin
from .models import FactSet, Template, Card, FactSetSchema, Tracker
from django.forms import ModelForm
from django.forms.models import BaseInlineFormSet

from django.template import Template as DjTemplate, Context

class FactSetInlineFormset(BaseInlineFormSet):
    def __init__(self, *args, **kwargs):
        self.schema = kwargs['instance']
        super().__init__(*args, **kwargs)

    def get_form_kwargs(self, *args, **kwargs):
        kw = super().get_form_kwargs(*args, **kwargs)
        kw['schema'] = self.schema
        return kw


class FactSetForm(ModelForm):
    """ Support for dynamic schemas in django-jsonform requires passing the instance in
    post init
    """
    def __init__(self, *args, **kwargs):
        self.schema = kwargs.pop('schema', None)
        super().__init__(*args, **kwargs)
        # manually set the current instance on the widget, to support dynamic schema
        if not self.instance.id and self.schema:
            self.instance.schema = self.schema
        self.fields['facts'].widget.instance = self.instance


class FactSetInline(admin.StackedInline):
    model = FactSet
    form = FactSetForm
    formset = FactSetInlineFormset

    extra = 0


class CardMixin:
    def render_side(self, obj, side):
        t = DjTemplate(getattr(obj.template, side))
        rendered_content = t.render(Context(obj.fact_set.facts))
        return rendered_content

    def render_front(self, obj):
        return self.render_side(obj, "front")

    def render_back(self, obj):
        return self.render_side(obj, "back")


class CardInline(admin.StackedInline, CardMixin):
    model = Card
    readonly_fields = ('render_front', 'render_back')
    extra = 0



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
        CardInline,
    ]

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')
    inlines = [
        CardInline,
    ]

@admin.register(Card)
class CardAdmin(admin.ModelAdmin, CardMixin):
    list_display = ('template', 'fact_set', 'id')
    readonly_fields = ('render_front', 'render_back')


@admin.register(Tracker)
class TrackerAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'modified')
