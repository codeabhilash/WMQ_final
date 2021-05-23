from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from .models import Project, GPS
from .serializers import ProjectSerializer, GPSSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.template import loader
import random
import uuid
import json
from decimal import Decimal
from django.template import RequestContext
from django.views import defaults

@csrf_exempt
def wmq_params(request, random_id):
    latest_question_list = ["Hello is this wmq?", "wat"]
    template = loader.get_template('wmq/wmq.html')
    proj = Project.objects.filter(rand_id=random_id).order_by('-date')[0]
    mesh_id = proj.mesh_id
    im_id = proj.ims_id
    def_id = proj.def_id
    context = {
        'mesh_id': mesh_id,
        'im_id': im_id,
        'def_id': def_id,
    }
    return HttpResponse(template.render(context, request))

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return json.JSONEncoder.default(self, obj)

@api_view(['POST'])
def test(request):
    test = '[{"longitude": 130.4439719, "latitude": 33.36309, "height": 81.028}, {"longitude": 130.4439832, "latitude": 33.3631007, "height": 81.147}, {"longitude": 130.4439615, "latitude": 33.3630785, "height": 80.991}, {"longitude": 130.444038, "latitude": 33.3631288, "height": 81.063}, {"longitude": 130.4439478, "latitude": 33.36307, "height": 81.035}, {"longitude": 130.4440443, "latitude": 33.3631304, "height": 81.147}, {"longitude": 130.443915, "latitude": 33.3630482, "height": 81.047}, {"longitude": 130.4439972, "latitude": 33.3631083, "height": 81.12}, {"longitude": 130.4439381, "latitude": 33.3630632, "height": 81.11}, {"longitude": 130.4440203, "latitude": 33.3631215, "height": 81.063}, {"longitude": 130.4440111, "latitude": 33.3631156, "height": 81.054}, {"longitude": 130.4439266, "latitude": 33.3630554, "height": 81.116}, {"longitude": 130.4440473, "latitude": 33.3631324, "height": 81.113}, {"longitude": 130.4440478, "latitude": 33.3631326, "height": 81.118}, {"longitude": 130.4440302, "latitude": 33.363125, "height": 81.046}]'
    testt = json.loads(test)
    html = "<html><body><p>%s</p></body></html>" % testt
    return HttpResponse(html)
    
@api_view(['POST', ])
def store_gps(request):
    if request.method == 'POST':
        serializer = GPSSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.errors, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def load_gps(request, task_id):
    gps_coords = GPS.objects.filter(task_id=task_id).order_by('date')
    gps_list = []
    for i in range(len(gps_coords)):
        gps_i = dict()
        gps_i["latitude"] = gps_coords[i].latitude()
        gps_i["longitude"] = gps_coords[i].longitude()
        gps_i["height"] = gps_coords[i].height()
        gps_list.append(gps_i)


    return HttpResponse(str(gps_list))


def wmq_params_gps(request, random_id):

    latest_question_list = ["Hello is this wmq?", "wat"]
    template = loader.get_template('wmq/wmq.html')
    proj = Project.objects.filter(rand_id=random_id).order_by('-date')[0]
    mesh_id = proj.mesh_id
    im_id = proj.ims_id
    def_id = proj.def_id

    gps_coords = GPS.objects.filter(rand_id=random_id).order_by('date')
    gps_list = []
    for i in range(len(gps_coords)):
        gps_i = dict()
        lon = gps_coords[i].longitude()
        lat = gps_coords[i].latitude()
        ht = gps_coords[i].height()
        gps_i["longitude"] = json.dumps(lon, cls=DecimalEncoder)
        gps_i["latitude"] = json.dumps(lat, cls=DecimalEncoder)
        gps_i["height"] = json.dumps(ht, cls=DecimalEncoder)
        gps_list.append(gps_i)


    gps_str = gps_list

    context = {
        'mesh_id': mesh_id,
        'im_id': im_id,
        'def_id': def_id,
        'gps_info': json.dumps(gps_str)
    }
    return HttpResponse(template.render(context, request))

@api_view(['GET', 'POST'])
def user_projects_all(request, usr_id):
    if request.method == 'GET':
        user_projects = Project.objects.filter(user_id=usr_id)
        serializer = ProjectSerializer(user_projects, many=True)
        return Response(serializer.data)

@api_view(['POST', ])
def store_project(request):
    if request.method == 'POST':
        serializer = ProjectSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.errors, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def projects_all(request):
    if request.method == 'GET':
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

def handler404(request, *args, **argv):
    return render(request, 'wmq/500.html')

    response.status_code = 404
    return response

def handler405(request):
    return render(request, 'wmq/500.html')

def handler500(request):
    return render(request, 'wmq/500.html')
