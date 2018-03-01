from django.db import models

class Logs(models.Model):
  ip = models.CharField(max_length=32)
  uuid = models.CharField(max_length=64)
  device = models.CharField(max_length=128)
  project = models.CharField(max_length=32)
  type = models.CharField(max_length=32)
  url = models.CharField(max_length=128)
  line = models.CharField(max_length=32)
  col = models.CharField(max_length=32)
  message = models.CharField(max_length=512)
  time = models.DateTimeField('date published')