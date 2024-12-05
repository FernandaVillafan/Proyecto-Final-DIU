from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.contrib.auth import authenticate

from user.api.serializers import CreateUserSerializer, UserSerializer
from ..models import User
#from habits.models import Habit

"""
    Función Login que debe recibir el username y el password.
"""
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({"error": "Nombre de usuario y contraseña son obligatorios"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, username=username)
        
        # Verificar la contraseña
        if not user.check_password(password):
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

        # Generar el access token
        access_token = AccessToken.for_user(user)
        
        return Response({"access": str(access_token)}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Para logout simple, simplemente regresamos un mensaje de éxito
        return Response({"message": "Sesión cerrada correctamente"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
"""
    Función para crear un nuevo usuario y guardarlo en la base de datos.
"""
@api_view(['POST'])
def create_user(request):
    try:
        user_data = request.data
        
        # Verificar que las contraseñas coincidan
        if (user_data['password'] != user_data['password_confirmation']):
            return Response({'message': 'Las contraseñas no coinciden'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Eliminar el campo de confirmación de contraseña para que no sea serializado
        user_data.pop('password_confirmation')
        
        user_serializer = CreateUserSerializer(data=user_data)
        
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.set_password(user_data['password']) # Encriptar la contraseña
            user.save()
            return Response({'message': 'Usuario creado con éxito'}, status=status.HTTP_201_CREATED)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as _:
        return Response({'message': 'Error al intentar crear un nuevo usuario'}, status=status.HTTP_400_BAD_REQUEST)
    
"""
    Función para obtener la informacion general del usuario loggeado.
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_user(request):
    try:
        user_id = request.user.id 
        user = get_object_or_404(User, id=user_id) # Obtener el usuario de la base de datos
        user_serializer = UserSerializer(user)
                    
        return Response(user_serializer.data, status=status.HTTP_200_OK)
    except Exception as _:
        return Response({'message': 'Error al intentar obtener el usuario'}, status=status.HTTP_400_BAD_REQUEST)