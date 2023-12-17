from django.urls import path
from . import views
urlpatterns = [
#    path("", views.index, name="index"),
    path('deck/<int:pk>/', views.DeckDetailView.as_view(), name='deck-detail'),
    path('deck/<int:deck_id>/start', views.start_quiz, name='start-quiz'),
    path('deck/<int:deck_id>/result/<int:card_id>', views.track_result_new_card, name='track-result'),
]
