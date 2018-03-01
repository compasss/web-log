from django.urls import include, path
from django.contrib import admin

urlpatterns = [
  path('logs/', include('logs.urls')),
  path('admin/', admin.site.urls),
]