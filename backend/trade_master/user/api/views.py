from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.contrib.auth import authenticate

from user.api.serializers import CreateUserSerializer, UserSerializer, UpdateUserSerializer
from ..models import User

"""
    Función Login que debe recibir el username y el password
"""
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        form_data = request.data
        
        if not form_data['username'] or not form_data['password']:
            return Response({"message": "El username y la contraseña son obligatorios"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificamos el username
        if not User.objects.filter(username=form_data['username']).exists():
            return Response({"message": "No hay ningún usuario registrado con ese username"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, username=form_data['username'])
        
        # Verificamos la contraseña
        if not user.check_password(form_data['password']):
            return Response({"message": "Credenciales inválidas<br>Inténtalo nuevamente"}, status=status.HTTP_401_UNAUTHORIZED)

        # Generamos el access token
        access_token = AccessToken.for_user(user)
        
        return Response({"access": str(access_token)}, status=status.HTTP_200_OK)

    except Exception as _:
        return Response({'message': 'Error al intentar iniciar sesión'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

"""
    Función Logout
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Para logout simple, simplemente regresamos un mensaje de éxito
        return Response({"message": "Sesión cerrada correctamente"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as _:
        return Response({'message': 'Error al intentar cerrar la sesión'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
"""
    Función para crear un nuevo usuario y guardarlo en la base de datos
"""
@api_view(['POST'])
def create_user(request):
    try:
        user_data = request.data
        
        # Verificamos si ya existe el correo
        if User.objects.filter(email=user_data['email']).exists():
            return Response({'message': 'Ya existe una cuenta con ese correo'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificamos que las contraseñas coincidan
        if (user_data['password'] != user_data['confirm_password']):
            return Response({'message': 'Las contraseñas no coinciden'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificamos si ya existe el username
        if User.objects.filter(username=user_data['username']).exists():
            return Response({'message': 'El username no está disponible'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Eliminamos el campo de confirmación de contraseña para que no sea serializado
        user_data.pop('confirm_password')
        
        user_serializer = CreateUserSerializer(data=user_data)
        
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.set_password(user_data['password']) # Encriptamos la contraseña
            user.save()
            return Response({'message': '¡Tu cuenta ha sido creada exitosamente!'}, status=status.HTTP_201_CREATED)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as _:
        return Response({'message': 'Error al intentar crear un nuevo usuario'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
"""
    Función para obtener la información general del usuario loggeado
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_user(request):
    try:
        user_id = request.user.id 
        user = get_object_or_404(User, id=user_id) # Obtenemos el usuario de la base de datos
        user_serializer = UserSerializer(user)
                    
        return Response(user_serializer.data, status=status.HTTP_200_OK)
    
    except Exception as _:
        return Response({'message': 'Error al intentar obtener el usuario'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
"""
    Función para actualizar los datos del usuario loggeado
"""
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    try:
        user = request.user
        data = request.data.copy()
        
        # Si se envió password y confirm_password, verificamos que coincidan
        if 'password' in data and 'confirm_password' in data:
            if data['password'] != data['confirm_password']:
                return Response({'message': 'Las contraseñas no coinciden'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Si coinciden, eliminamos confirm_password antes de la serialización
            data.pop('confirm_password')
        elif 'password' in data:
            # Si solo se envió password sin confirm_password, mandamos un error
            return Response({'message': 'Se requiere la confirmación de la contraseña'}, status=status.HTTP_400_BAD_REQUEST)
        
        update_serializer = UpdateUserSerializer(user, data=data, partial=True)
        
        if update_serializer.is_valid():
            updated_user = update_serializer.save()
            
            if 'password' in data:
                updated_user.set_password(data['password'])
                updated_user.save()
                
            # Devolvemos los datos actualizados usando el UserSerializer
            user_serializer = UserSerializer(updated_user)
            return Response(
                { 'message': '¡Tus datos han sido actualizados correctamente!',
                  'data': user_serializer.data
                }, status=status.HTTP_200_OK)
        else:
            return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as _:
        return Response({'message': 'Error al intentar actualizar el usuario'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
"""
    Función para actualizar la foto de perfil del usuario loggeado
"""
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_image(request):
    try:
        user = request.user
        image = request.FILES.get('image')
        
        if not image:
            return Response({'message': 'No se ha proporcionado ninguna imagen'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Actualizamos la imagen del usuario
        user.image = image
        user.save()
        
        # Devolvemos los datos actualizados usando el UserSerializer
        user_serializer = UserSerializer(user)
        return Response(
            { "message": '¡Tu imagen ha sido actualizada correctamente!',
              "data": user_serializer.data
            }, status=status.HTTP_200_OK)
        
    except Exception as _:
        return Response({'message': 'Error al intentar actualizar la imagen'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)