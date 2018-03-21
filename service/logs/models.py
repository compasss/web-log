from django.db import models
import uuid
import django.utils.timezone as timezone

class Logs(models.Model):
  ip = models.GenericIPAddressField(protocol='both', unpack_ipv4=False,)
  uuid = models.UUIDField(default=uuid.uuid4, editable=False)
  device = models.CharField(max_length=128)
  project = models.CharField(max_length=32)
  type = models.CharField(max_length=32)
  url = models.CharField(max_length=128)
  line = models.CharField(max_length=32)
  col = models.CharField(max_length=32)
  message = models.CharField(max_length=512)
  time = models.DateTimeField('date created', default = timezone.now)