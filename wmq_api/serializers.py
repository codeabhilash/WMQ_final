from rest_framework import serializers
from .models import Project, GPS



class ProjectSerializer(serializers.ModelSerializer):
        class Meta:
            model = Project
            fields = ['task_id', 'user_id', 'p_id', 'f_id', 'mesh_id', 'ims_id', 'def_id', 'rand_id', 'project_name', 'date']


class GPSSerializer(serializers.ModelSerializer):
        class Meta:
            model = GPS
            fields = ['rand_id', 'gps_latitude', 'gps_longitude', 'gps_height', 'gps_id', 'task_id', 'date']