from django.db import models
from user.models import User
from django.utils.timezone import now

# Create your models here.
class Comic(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    publisher = models.CharField(max_length=100)
    edition = models.CharField(max_length=100)
    condition = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    image = models.ImageField(upload_to='comic_images/', blank=True, null=False)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comics_sold')
    is_sold = models.BooleanField(default=False)  # True: vendido, False: No vendido
    category = models.CharField(max_length=100, default='Independiente')
    
    def __str__(self):
        return f"Title: {self.title}, Publisher: {self.publisher}"

class TradeOffer(models.Model):
    id = models.AutoField(primary_key=True)
    service = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    description = models.TextField()
    comic = models.ForeignKey(Comic, on_delete=models.CASCADE, related_name='trade_offers')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trade_offers_seller')
    trader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trade_offers_trader')
    status = models.IntegerField(default=0)  # 0: Pendiente, 1: Aceptada, 2: Rechazada
    image = models.ImageField(upload_to='trade_images/', blank=True, null=True)
    date = models.DateField(default=now) 
    
    def __str__(self):
        return f"Service: {self.service}, Title: {self.title}, Description: {self.description}, Status: {self.status}, Seller: {self.seller}, Trader: {self.trader}"

class WishList(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlists')
    comic = models.ForeignKey(Comic, on_delete=models.CASCADE, related_name='wishlisted_by')
    
    def __str__(self):
        return f"User: {self.user}, Comic: {self.comic}"