#for future development?
from django import forms

from models import Template, Topos, School, SchoolAdmin, Student, Teacher, Course, Deck, TemplateForm, Carton, CartonForm

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column, Field, Fieldset, ButtonHolder, Div, HTML, Button
from crispy_forms.bootstrap import AppendedText, PrependedText, FormActions

class CartonForm(forms.ModelForm):
    def __init__(self, **topoi):
        super(CartonForm, self).__init__(**topoi)
        self.helper = FormHelper()
        self.helper.form_id = 'id-cartonForm'
        self.helper.form_method = 'post'
        self.helper.form_action = 'makeCarton'

        # Topoi need to be ordered by their rank...
        for topos in topoi:
            self.helper.layout.add_input(topos.name, topos.name)

        self.helper.layout.append(Submit('submit', 'Submit'))
    
    class Meta:
        model = Carton
        fields = ['dota']