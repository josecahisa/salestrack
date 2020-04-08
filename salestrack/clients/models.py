from django.db import models

class Fiscal_Position(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return '{0}'.format(self.name)

    class Meta:
        verbose_name = "Posición Fiscal"
        verbose_name_plural = "Posiciones Fiscales"

class Client(models.Model):
    CLIENT_STATUS_CHOICES = (
        ('A', 'Activo'),
        ('B', 'Borrado')
    )

    name = models.CharField(max_length=150, null=True, blank=True, verbose_name="Nombre")
    status = models.CharField(max_length=1, default='A', choices=CLIENT_STATUS_CHOICES, verbose_name="Estado")
    fiscal_position = models.ForeignKey(Fiscal_Position, on_delete=models.PROTECT, null=True, blank=True)
    nit = models.CharField(max_length=20, null=True, blank=True, verbose_name="NIT")

    def __str__(self):
        return '{0}'.format(self.name)

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"

class Address_Type(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return '{0}'.format(self.name)

    class Meta:
        verbose_name = "Tipo de Dirección"
        verbose_name_plural = "Tipos de Dirección"

class Country(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return '{0}'.format(self.name)

    class Meta:
        verbose_name = "País"
        verbose_name_plural = "Países"

class Region(models.Model):
    country = models.ForeignKey(Country, on_delete=models.PROTECT, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return '{0}'.format(self.name)

    class Meta:
        verbose_name = "Región"
        verbose_name_plural = "Regiones"


class City(models.Model):
    region = models.ForeignKey(Region, on_delete=models.PROTECT, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return '{0}'.format(self.name)

    class Meta:
        verbose_name = "Ciudad"
        verbose_name_plural = "Ciudades"

class Address(models.Model):
    address_type = models.ForeignKey(Address_Type, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Tipo")
    address = models.CharField(max_length=50, null=True, blank=True, verbose_name="Dirección")
    description = models.CharField(max_length=250, null=True, blank=True, verbose_name="Descripción")
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Ciudad")

    def __str__(self):
        return '{0} - {1}'.format(self.address_type, self.address)

    class Meta:
        verbose_name = "Dirección"
        verbose_name_plural = "Direcciones"

class Phone_Type(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return '{0}'.format(self.name)

    class Meta:
        verbose_name = "Tipo Teléfono"
        verbose_name_plural = "Tipos de Teléfonos"

class Telephone(models.Model):
    number = models.CharField(max_length=20, null=True, blank=True, verbose_name="Número")
    description = models.CharField(max_length=250, null=True, blank=True, verbose_name="Descripción")
    phone_type = models.ForeignKey(Phone_Type, on_delete=models.PROTECT, null=True, blank=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)

    def __str__(self):
        return '{0} - {1}'.format(self.phone_type, self.number)

    class Meta:
        verbose_name = "Teléfono"
        verbose_name_plural = "Teléfonos"

