from django.db import models
from django.conf import settings

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.hashers import make_password, check_password
import json

class User(AbstractBaseUser , PermissionsMixin):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False)
    last_name = models.CharField(max_length=255, null=False)
    username = models.CharField(max_length=255, unique=True, null=False)
    email = models.EmailField(max_length=255, unique=True, null=False)
    password = models.CharField(max_length=255, null=False)
    phone = models.CharField(max_length=255, null=True)
    image = models.ImageField(upload_to=settings.USER_IMAGES_PATH, blank=True, null=True)
    trades_count = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
      
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['name', 'last_name', 'email', 'password', 'phone']
    
    class Meta:
        indexes = [
            models.Index(fields=['username', 'email']),
        ]
    
    def __str__(self):
        return f"""id: {self.id}, 
                 name: {self.name}, 
                 last_name: {self.last_name}, 
                 username: {self.username}, 
                 email: {self.email}, 
                 phone: {self.phone},
                 image: {self.image},
                 trades_count: {self.trades_count},
                 rating: {self.rating}"""
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
        }
        
    def login_info(self):
        return {
            'id' : self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'last_name': self.last_name
        }
    
    def to_json(self):
        return json.dumps(self.to_dict())
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        
    def check_password(self, password):
        return check_password(password, self.password)