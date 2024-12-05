from rest_framework import serializers
from ..models import User

"""
    Serializador para el modelo User
"""
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'last_name', 'username', 'email']
        
"""
    Serializador corto para el modelo User
"""
class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'last_name']
        
"""
    Serializador con los campos requeridos para crear un usuario
"""
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'last_name', 'username', 'email', 'password', 'phone']
        
    def validate(self, data):
        error = {}
        for field in data:
            if not data[field]:
                error[field] = f"{field} is required"
        if error:
            raise serializers.ValidationError(error)
        return data