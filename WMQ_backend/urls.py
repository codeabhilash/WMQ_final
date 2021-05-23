from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings


if settings.ADMIN_ENABLED:
    urlpatterns = [
        path('', TemplateView.as_view(template_name='index.html')),
        path('admin/', admin.site.urls),
        path('', include('wmq_api.urls')),
    ]
else: 
    urlpatterns = [
        path('', TemplateView.as_view(template_name='index.html')),
        path('', include('wmq_api.urls')),
    ]

handler404 = 'wmq_api.views.handler404'
handler405 = 'wmq_api.views.handler405'
handler500 = 'wmq_api.views.handler500'

