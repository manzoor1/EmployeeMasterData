from django.urls import path
from . import views

urlpatterns = [
    path('employees/', views.get_employees, name='get_employees'),
    path('employees/add/', views.add_employee, name='add_employee'),
]
