from django.db import models
from django.conf import settings
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
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to=settings.COMIC_IMAGES_PATH, blank=False, null=False)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comics_sold')
    is_sold = models.BooleanField(default=False)  # True: vendido, False: No vendido
    category = models.CharField(max_length=100, default='Independiente')
    
    def __str__(self):
        return f"""id: {self.id},
                 title: {self.title}, 
                 publisher: {self.publisher},
                 price: {self.price},
                 seller: {self.seller}"""

class TradeOffer(models.Model):
    id = models.AutoField(primary_key=True)
    offerType = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    description = models.TextField()
    comic = models.ForeignKey(Comic, on_delete=models.CASCADE, related_name='trade_offers')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trade_offers_seller')
    trader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trade_offers_trader')
    status = models.IntegerField(default=0)  # 0: Pendiente, 1: Aceptada, 2: Rechazada
    image = models.ImageField(upload_to=settings.TRADE_IMAGES_PATH, blank=True, null=True)
    date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"""id: {self.id},
                 offer type: {self.offerType}, 
                 title: {self.title}, 
                 description: {self.description}, 
                 seller: {self.seller}, 
                 trader: {self.trader},
                 status: {self.status},
                 date: {self.date}"""

class WishList(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlists')
    comic = models.ForeignKey(Comic, on_delete=models.CASCADE, related_name='wishlisted_by')
    
    def __str__(self):
        return f"""id: {self.id},
                 user: {self.user}, 
                 comic: {self.comic}"""