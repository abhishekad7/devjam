from django.db import models

# Create your models here.



#model to store hosted games
class Hosted(models.Model):

	hostname=models.CharField(max_length=100, null=False, blank=False)
	ingame=models.BooleanField(blank=False, null=False, default=False)
	two=models.IntegerField(blank=False, null=False, default=0)

