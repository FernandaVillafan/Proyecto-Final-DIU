from rest_framework import serializers
from comic.models import Comic, WishList, TradeOffer
from user.api.serializers import UserShortSerializer

"""
    Serializador para el modelo Comic
"""
class ComicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comic
        fields = '__all__'
        
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
        