from django.db import models

class UserResponse(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
