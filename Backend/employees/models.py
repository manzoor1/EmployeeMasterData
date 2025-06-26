from django.db import models

class Employee(models.Model):
    employee_id = models.CharField(max_length=50)
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    address = models.TextField()
    contact_number = models.CharField(max_length=20)
    date_of_joining = models.DateField()
    bank_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=50)

    def __str__(self):
        return self.full_name
