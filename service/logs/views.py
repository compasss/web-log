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
    ip = request.GET.get('ip', False)
    project = request.GET.get('project', False)
    type = request.GET.get('type', False)
    line = request.GET.get('line', False)
    col = request.GET.get('col', False)
    startTime = request.GET.get('startTime', False)
    endTime = request.GET.get('endTime', false)
  except ValueError:
    page = 1
    rows = 1
  offset = (page - 1) * rows
  end = page * rows

  if project:
    pass


  re = list(Logs.objects.values('ip', 'line'))
  res = re[offset:end]
  return JsonResponse(res, safe=False)
