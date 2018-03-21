from django.http import HttpResponse
from django.http import JsonResponse
from django.core import serializers
from django.views.decorators.http import require_http_methods
import time

from .models import Logs
import json

def index(request):
  return HttpResponse("log api")

@require_http_methods(['GET', 'POST'])
def add(request):
  b = Logs(ip = request.GET.get('ip', ''),
    device = request.GET.get('device', ''),
    project = request.GET.get('project', ''),
    type = request.GET.get('type', ''),
    url = request.GET.get('url', ''),
    line = request.GET.get('line', ''),
    col = request.GET.get('col', ''),
    message = request.GET.get('message', ''))
  b.save()
  return JsonResponse({'success': True, 'data': []})

def deleteById(request):
  print(1)

@require_http_methods(['GET'])
def logList(request):
  try:  
    page = int(request.GET.get('page', '1'))
    rows = int(request.GET.get('rows','1'))
  except ValueError:
    page = 1
    rows = 1
  offset = (page - 1) * rows
  end = page * rows
  res = Logs.objects.all()[offset:end]
  return JsonResponse(serializers.serialize('json', res), safe=False, content_type='application/json')
