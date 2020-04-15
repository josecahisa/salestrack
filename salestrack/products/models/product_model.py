from django.db import models
from django.utils.safestring import mark_safe

class Business_Unit(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Unidad de Negocio"
        verbose_name_plural = "Unidades de Negocio"

class Brand(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"

class Classification(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Clasificación"
        verbose_name_plural = "Clasificaciones"

class Category(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorias"

class Product(models.Model):
    PRODUCT_STATUS_CHOICES = (
        ('A', 'Activo'),
        ('B', 'Borrado')
    )

    description = models.CharField(max_length=100, null=True, blank=True, verbose_name="Descripcion")
    status = models.CharField(max_length=1, default='A', choices=PRODUCT_STATUS_CHOICES, verbose_name="Estado")
    wholesale_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Precio Mayorista", default=0, null=True, blank=True)
    provider_alpha_code = models.CharField(max_length=20, verbose_name="Codigo Maquina")
    provider_code = models.CharField(max_length=20, verbose_name="Codigo")
    business_unit = models.ForeignKey(Business_Unit, on_delete=models.PROTECT, null=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, null=True, blank=True)
    classification = models.ForeignKey(Classification, on_delete=models.PROTECT, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, null=True, blank=True)

    fechaUltimaModificacion = models.DateTimeField(auto_now=True)
    fechaCreacion = models.DateTimeField(auto_now_add=True)
    is_accesory = models.BooleanField(verbose_name="Es Accesorio", default=False)
    free_accesories = models.IntegerField(verbose_name="Cant Accesorios Incluidos", default=0)

    photo = models.ImageField(upload_to='products', null=True, blank=True)

    def photo_thumbnail(self):
        if self.photo:
            return mark_safe('<img src="%s" style="width: 45px; height:45px;" />' % self.photo.url)
        else:
            return ''
    
    photo_thumbnail.short_description = 'Foto'

    def photo_tag(self):
        if self.photo:
            return mark_safe('<img src="%s" style="width: 150px; height:150px;"  />' % (self.photo.url))
        else:
            return ''

    photo_tag.description = 'Imagen del producto'

    def __str__(self):
        return '{0} - {1}'.format(self.provider_alpha_code, self.description)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"




