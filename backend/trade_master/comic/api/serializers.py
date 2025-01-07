from rest_framework import serializers
from comic.models import Comic, WishList, TradeOffer
from user.api.serializers import UserShortSerializer

"""
    Serializador para el modelo Comic
"""
class ComicSerializer(serializers.ModelSerializer):
    seller = UserShortSerializer(read_only=True)
    class Meta:
        model = Comic
        fields = '__all__'
        
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['seller'] = request.user
        return super().create(validated_data)
    
"""
    Serializador para actualizar los datos de un cómic
"""
class UpdateComicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comic
        fields = ['title', 'publisher', 'edition', 'condition', 'description', 'price', 'image', 'category']
        extra_kwargs = {
            'title': {'required': False},
            'publisher': {'required': False},
            'edition': {'required': False},
            'condition': {'required': False},
            'description': {'required': False},
            'price': {'required': False},
            'image': {'required': False},
            'category': {'required': False},
        }
        
        def validate(self, data):
            # Solo validamos los campos que viene en la petición
            for field_name, value in data.items():
                if not value or str(value).strip() == "":
                    raise serializers.ValidationError(f"El campo {field_name} no puede estar vacío")
            return data
        
"""
    Serializador para el modelo WishList
"""
class WishListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishList
        fields = '__all__'
        
"""
    Serializador para limitar la información de la lista de deseos
"""
class MyWishListSerializer(serializers.ModelSerializer):
    comic = ComicSerializer()
    
    class Meta:
        model = WishList
        fields = ['id','comic']
        
"""
    Serializador para el modelo TradeOffer
"""
class TradeOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeOffer
        fields = '__all__'
        
"""
    Serializador para obtener la información relacionada de la oferta de intercambio   
"""       
class TradeOfferDetailSerializer(serializers.ModelSerializer):
    comic = ComicSerializer()
    seller = UserShortSerializer()
    trader = UserShortSerializer()
    
    class Meta:
        model = TradeOffer
        fields = '__all__'