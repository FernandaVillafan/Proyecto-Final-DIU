from rest_framework import serializers
from ..models import User

"""
    Serializador para el modelo User
"""
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'last_name', 'username', 'email', 'phone', 'image']
        
"""
    Serializador corto para el modelo User
"""
class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'last_name', 'username', 'trades_count', 'rating']
        
"""
    Serializador con los campos requeridos para crear un usuario
"""
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'last_name', 'username', 'email', 'password', 'phone', 'image']
        
    def validate(self, data):
        error = {}
        for field in data:
            if not data[field]:
                error[field] = f"{field} is required"
        if error:
            raise serializers.ValidationError(error)
        return data
    
"""
    Serializador para actualizar los datos de un usuario
"""
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'last_name', 'username', 'email', 'password', 'phone', 'image']
        extra_kwargs = {
            'name': {'required': False},
            'last_name': {'required': False},
            'username': {'required': False},
            'email': {'required': False},
            'password': {'required': False},
            'phone': {'required': False},
            'image': {'required': False},
        }
        
    def validate(self, data):
        # Solo validamos los campos que vienen en la petición
        for field_name, value in data.items():
            if not value or str(value).strip() == "":
                raise serializers.ValidationError(f"El campo {field_name} no puede estar vacío")
        return data