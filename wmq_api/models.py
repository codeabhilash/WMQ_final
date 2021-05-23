from django.db import models
from django.core.validators import MinLengthValidator

class Project(models.Model):
        task_id = models.AutoField(primary_key=True)
        user_id = models.IntegerField(default=0)
        p_id = models.IntegerField(default=0)
        f_id = models.IntegerField(default=0)
        mesh_id = models.IntegerField(default=0)
        ims_id = models.IntegerField(default=0)
        def_id = models.IntegerField(default=0)
        rand_id = models.CharField(max_length=74, validators=[MinLengthValidator(44)])
        # random_id = models.IntegerField(default=0)
        # myfield = models.IntegerField(validators=[MinValueValidator(999), MaxValueValidator(100)])
        project_name = models.CharField(max_length=200)
        date = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return str(self.task_id)


class GPS(models.Model):
        gps_id = models.AutoField(primary_key=True)
        rand_id = models.CharField(max_length=74, validators=[MinLengthValidator(44)])
        gps_latitude = models.DecimalField(default=1.00, max_digits=12, decimal_places=8)
        gps_longitude = models.DecimalField(default=1.00, max_digits=12, decimal_places=8)
        gps_height = models.DecimalField(default=1.00, max_digits=12, decimal_places=8)
        task_id = models.ForeignKey(Project, on_delete=models.CASCADE)
        date = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return self.rand_id

        def longitude(self):
            return self.gps_longitude
        
        def latitude(self):
            return self.gps_latitude
        
        def height(self):
            return self.gps_height


